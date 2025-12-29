import Document from '../models/document.js';
import Flashcard from '../models/flashcard.js';
import quiz from '../models/quiz.js';
import {chunkText} from '../utils/textChunker.js';
import fs from 'fs';
import mongoose from 'mongoose';
import extractTextFromPDF from '../utils/pdfParser.js';
import path from 'path';

//@desc upload document
//access private
//route POST /api/documents/upload
// Upload a new document
export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' , statusCode: 400 });
    }
    
    const { title } = req.body;

    if(!title) {//delete uploaded file if title not provided
        await fs.unlink(req.file.path);
        return res.status(400).json({ success: false, error: 'Title is required' , statusCode: 400 });
    }

    //construct the url for the uploaded file

    const baseUrl = `http://localhost:${process.env.PORT || 8000}`;
    const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;

    //create document entry in database

    const document = await Document.create({
      userId: req.user._id,
      title,
      fileName: req.file.originalname,
      filePath: fileUrl,
      fileSize: req.file.size,
      status: 'processing'
    });

    processPDF(document._id, req.file.path).catch(err => {console.error('Error processing PDF:', err)});
    res.status(201).json({ success: true, data: document, message: 'Document uploaded successfully' });
} 
    
    catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path).catch(err => console.error('Error deleting file after upload failure:', err));
        }
    next(error);
  }
};

//Helper function to process PDF: extract text, chunk it, and update document status
export const processPDF = async (documentId, filePath) => {
  try {
    const {text} = await extractTextFromPDF(filePath);
    //create chunks from extracted text
    const chunks = chunkText(text, 500, 50); //chunk size of 500 words

    //update document
    await Document.findByIdAndUpdate(documentId, {
      extractedText: text,
      chuncks: chunkObjects,
      status: 'ready'
    });
    console.log(`Document ${documentId} processed successfully.`);
  } catch (error) {
        console.error(`Error in processPDF${documentId}:`, error);
        //update document status to failed
        await Document.findByIdAndUpdate(documentId, {
        status: 'failed'
        });
    }

};

// //@desc get user documents
// //access private
// //route GET /api/documents
// // Get documents for the logged-in user
// export const getDocuments = async (req, res, next) => {
//   try {
//     const documents = await Document.aggregate([
//         { 
//             $match: { userId: new mongoose.Types.ObjectId(req.user._id) } 
//         }, 
//         { 
//             $lookup: { 
//                 from: 'flashcards',
//                 localField: '_id',
//                 foreignField: 'documentId',
//                 as: 'flashcardSets'
//             }
//         },
//         { 
//             $lookup: { 
//                 from: 'quizzes',
//                 localField: '_id',
//                 foreignField: 'documentId',
//                 as: 'quizzes'
//             }
//         },
//         {
//             $addFields: {
//                 flashcardSets: { $size: '$flashcardSets' },
//                 quizCount: { $size: '$quizzes' }
//             }
//         },
//         {
//             $project: {
//                 flashcardSets: 0,
//                 extractedText: 0,
//                 chunks: 0,
//                 quizzes: 0
//             }   
//         },
//         { $sort: { uploadDate: -1 } }
    
//     ]);

//     res.status(200).json({ success: true, count: documents.length, data: documents });
    
//   } catch (error) {
//     next(error);
//   }
// };

// //@desc get all documents
// //access private
// //route GET /api/documents/:id
export const getDocuments = async (req, res, next) => {
  try {
    // Assuming req.user.isAdmin is set for admin users
    if (!req.user.isAdmin) {
      return res.status(401).json({ success: false, message: 'Not authorized to view all documents' });
    }
    const documents = await Document.find().sort({ uploadDate: -1 });
    res.status(200).json({ success: true, data: documents });
  } catch (error) {
    next(error);
  }
};

// //@desc get single document with chunks
// //access private
// //route GET /api/documents/:id
export const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    // Check if the document belongs to the logged-in user
    if (document.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to view this document' });
    }
    res.status(200).json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
}

// // Delete a document
// //@desc delete document
// //access private
// //route DELETE /api/documents/:id
export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    // Check if the document belongs to the logged-in user
    if (document.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this document' });
    }
    // Delete the file from the filesystem
    fs.unlinkSync(path.resolve(document.filePath));
    // Remove document from database
    await document.remove();
    res.status(200).json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    next(error);
  }
};


// // Update document metadata
export const updateDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    // Check if the document belongs to the logged-in user
    if (document.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this document' });
    }
    const { title } = req.body;
    document.title = title || document.title;
    await document.save();
    res.status(200).json({ success: true, data: document, message: 'Document updated successfully' });
  } catch (error) {
    next(error);
  }
};

// // Get all documents (admin only)

// import mongoose from 'mongoose';
// import { ifError } from 'assert';

// const documentSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     title: {
//         type: String,
//         required: [true, 'Please provide a title for the document'],
//         trim: true
//     },
//     fileName: {
//         type: String,
//         required: [true, 'File name is required']
//     },
//     filePath: {
//         type: String,
//         required: [true, 'File path is required']
//     },
//     fileSize: {
//         type: Number