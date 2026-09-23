import api from "./api";

const CHATBOT_ENDPOINT = "/chatbot";

/**
 * Gửi tin nhắn đến Chatbot RAG
 * @param {string} message - Câu hỏi hoặc yêu cầu của người dùng
 * @param {Array<{role: string, text: string}>} history - Lịch sử hội thoại
 */
export const sendMessageToBot = async (message, history = []) => {
  const response = await api.post(`${CHATBOT_ENDPOINT}/chat`, {
    message,
    history,
  });
  return response.data;
};

/**
 * Lấy danh sách câu hỏi gợi ý nhanh
 */
export const getQuickQuestions = async () => {
  try {
    const response = await api.get(`${CHATBOT_ENDPOINT}/quick-questions`);
    return response.data?.questions || [];
  } catch (error) {
    console.error("Lỗi tải câu hỏi gợi ý của chatbot:", error);
    return [
      "Chính sách đổi trả hàng như thế nào?",
      "Chính sách bảo hành sản phẩm?",
      "Gợi ý sofa phòng khách đẹp",
      "Đơn hàng bao nhiêu được miễn phí ship?",
    ];
  }
};
