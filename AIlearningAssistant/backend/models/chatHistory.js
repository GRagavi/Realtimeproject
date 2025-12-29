import mangoose from 'mongoose';

const chatHistorySchema = new mangoose.Schema({
    userId: {
        type: mangoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    documentId: {
        type: mangoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    messages: [
        {
            role: {
                type: String,
                enum: ['user', 'assistant'],
                required: true
            },
            content: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
            relevantChunks: {
                type: [Number],
                default: []
            }
        }
    ]
}, {
    timestamps: true
});

chatHistorySchema.index({ userId: 1, documentId: 1 });
const ChatHistory = mangoose.model('ChatHistory', chatHistorySchema);

export default ChatHistory;