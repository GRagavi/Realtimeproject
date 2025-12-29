/****
 * Split text into chunks of a specified size with optional overlap.
 * @param {string} text - The text to be chunked.
 * @param {number} chunkSize - The maximum size of each chunk.
 * @param {number} overlap - The number of overlapping characters between chunks.
 * @returns {Array<{content:String, chunkIndex:Number, pageNumber:Number}>} - An array of text chunks.
 ****/
export const chunkText = (text, chunkSize = 500, overlap = 50) => {
    if (!text || text.trim().length === 0) {
        return [];  
    }

    //clean text while preserving paragraph strutcture
    const cleanedText = text.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').replace(/\n /g, ' ').replace(/ \n /g, '\n').trim();

    //split by paragraphs
    const paragraphs = cleanedText.split(/\n+/).filter(p => p.trim().length > 0);

    const chunks = [];
    let currentChunk = '';
    let currentWordCount = 0;
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
        const paragraphWords = paragraph.trim().split(/\s+/);
        const paragraphWordCount = paragraphWords.length;

        //if signle paregraph is larger than chunk size, split by words
        if (paragraphWordCount > chunkSize) {
            //flush current chunk
            if (currentWordCount > 0) {
                chunks.push({
                    content: currentChunk.join('\n\n'),
                    chunkIndex: chunkIndex++,
                    pageNumber: 0 // Placeholder, actual page number should be set during PDF parsing
                });
                currentChunk = [];
                currentWordCount = 0;
            }
        
            //split paragraph by word based chunks
            for (let i=0; i < paragraphWords.length; i += (chunkSize-overlap)) {
                const chunkWords = paragraphWords.slice(i, i + chunkSize);
                chunks.push({
                    content: chunkWords.join(' '),
                    chunkIndex: chunkIndex++,
                    pageNumber: 0 // Placeholder, actual page number should be set during PDF parsing
                });
                if(i + chunkSize >= paragraphWords.length) break 
            }
            continue;
        }

    
        //if adding this paragraph exceeds chunk size, flush current chunk
        if (currentWordCount + paragraphWordCount > chunkSize && currentChunk.length > 0) {
            chunks.push({
                content: currentChunk.join('\n\n'),
                chunkIndex: chunkIndex++,
                pageNumber: 0 // Placeholder, actual page number should be set during PDF parsing
            });

            //create overlap from previous chunk 
            const prevChunkText = currentChunk.join(' ');
            const prevChunkWords = prevChunkText.trim().split(/\s+/);
            const overlapText = prevChunkWords.slice(-Math.min(overlap, prevChunkWords.length)).join(' ');
            currentChunk = [overlapText, paragraph.trim()];
            currentWordCount = overlapText.split(/\s+/).length + paragraphWordCount;
        } else {
            //add paragraph to current chunk
            currentChunk.push(paragraph.trim());
            currentWordCount += paragraphWordCount;
        }
    };
    //Add remaining chunk
    if (currentChunk.length > 0) {
        chunks.push({
            content: currentChunk.join('\n\n'),
            chunkIndex: chunkIndex++,
            pageNumber: 0 // Placeholder, actual page number should be set during PDF parsing
        });
    }

    //fallback if no chunks created
    if (chunks.length === 0 && cleanedText.length > 0) {
        const allwords = cleanedText.split(/\s+/);
        for (let i=0; i < allwords.length; i += (chunkSize-overlap)) {
            const chunkWords = allwords.slice(i, i + chunkSize);
            chunks.push({
                content: chunkWords.join(' '),
                chunkIndex: chunkIndex++,
                pageNumber: 0 // Placeholder, actual page number should be set during PDF parsing
            });
            if(i + chunkSize >= allwords.length) break ;
        }
    }
    return chunks;
};
//find relevant chunks based on keyword matching
export const findRelevantChunks = (chunks, query, matchChunks = 3) => {
    if (!chunks || chunks.length === 0 || !query){
        return [];
    }
    
    //common stop words to ignore
    const stopWords = new Set(['the', 'is', 'in', 'and', 'to', 'a', 'of', 'that', 'it', 'on', 'for', 'as', 'with', 'was', 'at', 'by', 'an', 'be', 'this', 'from', 'or', 'are', 'but', 'not', 'have', 'has']);
    
    //extract and clean querywords & keywords from query
    const queryWords = query.toLowerCase().split(/\s+/).filter(word => !stopWords.has(word) && word.length > 2);
    const keywords = Array.from(new Set(queryWords)); //unique keywords

    //if no keywords, return empty
    if (queryWords.length === 0) 
    {
        //return clean meta objects without Mongoose document overhead
        return chunks.slice(0, matchChunks).map(chunk => ({
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
            id: chunk._id,
        }));
    }

    const scoredChunks = chunks.map((chunk,index) => {
        const content = chunk.content.toLowerCase();
        const contentWords = content.split(/\s+/).length;
        let score = 0;

        //score each query word
        for (const word of queryWords) {
            const exactMatches = (content.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
            score += exactMatches * 3;
        

        //partial matches
      
            const partialMatches = (content.match(new RegExp(word, 'g')) || []).length;
            score += Math.max(0, partialMatches - exactMatches) * 1.5;
        }

        //Multiply query words found
        const uniqueWordsFound = queryWords.filter(word => content.includes(word)).length;
        if (uniqueWordsFound > 1){
        score += uniqueWordsFound * 2;
        }
        //normalize score by chunk length
        const normalizedScore = score / Math.sqrt(contentWords);

        //Small bonus for earlier chunks
        const positionBonus = 1-(index / chunks.length)* 0.1;
        
        //return clean object without mongoose metadata 
        return { 
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id,
            score: normalizedScore * positionBonus,
            rawScore: score,
            matchedWords: uniqueWordsFound
        };
    });

    return scoredChunks
        .filter(chunk => chunk.score > 0)
        .sort((a,b) => {
            if (b.score !== a.score){ return b.score - a.score;}
            if (b.matchedWords !== a.matchedWords) {return b.matchedWords - a.matchedWords;}
            return a.chunkIndex - b.chunkIndex;
        })
        .slice(0, matchChunks);
};