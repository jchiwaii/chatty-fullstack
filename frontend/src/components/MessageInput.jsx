import { useRef, useState, useEffect } from "react";
import { useChat } from "../store/useChat";
import { useSocket } from "../store/useSocket";
import { Image, Send, X, Smile, Paperclip } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { sendMessage, selectedUser } = useChat();
  const { emitTyping } = useSocket();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [text]);

  // Handle typing indicators
  useEffect(() => {
    if (!selectedUser) return;

    if (text.trim() && !isTyping) {
      setIsTyping(true);
      emitTyping(selectedUser._id, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        emitTyping(selectedUser._id, false);
      }
    }, 1000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [text, selectedUser, isTyping, emitTyping]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      emitTyping(selectedUser._id, false);
    }

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const commonEmojis = [
    "😀",
    "😂",
    "😍",
    "🥰",
    "😊",
    "😎",
    "🤔",
    "😢",
    "😡",
    "👍",
    "👎",
    "❤️",
    "🔥",
    "💯",
    "🎉",
    "👏",
  ];

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      {/* Image Preview */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-4 flex items-center gap-3"
          >
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                type="button"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              <p className="font-medium">Image ready to send</p>
              <p className="text-xs">Click send or add a caption</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-4 p-4 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-lg"
          >
            <div className="grid grid-cols-8 gap-2">
              {commonEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setText((prev) => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="p-2 text-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex items-end gap-3">
        <div className="flex-1 relative">
          <div className="flex items-end bg-zinc-100 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors">
            {/* Attachment button */}
            <button
              type="button"
              className="p-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Text input */}
            <textarea
              ref={textareaRef}
              className="flex-1 px-2 py-3 bg-transparent border-none outline-none resize-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 min-h-[20px] max-h-[120px]"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={1}
            />

            {/* Emoji button */}
            <button
              type="button"
              className="p-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Image button */}
            <button
              type="button"
              className={`p-3 transition-colors ${
                imagePreview
                  ? "text-green-600 dark:text-green-400"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <Image className="w-5 h-5" />
            </button>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>

        {/* Send button */}
        <motion.button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-500 hover:to-purple-500 disabled:from-zinc-300 disabled:to-zinc-300 dark:disabled:from-zinc-700 dark:disabled:to-zinc-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </form>
    </div>
  );
};

export default MessageInput;
