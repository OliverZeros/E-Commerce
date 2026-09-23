import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { cartActions } from "../../redux/slices/cartSlice";
import { addToCartService } from "../../service/cartService";
import { sendMessageToBot, getQuickQuestions } from "../../service/chatbotService";
import "./chatbot.css";

// Icon AI tối giản, tinh tế chuẩn phong cách hiện đại
const AIIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2ZM19 15L20 17.5L22.5 18.5L20 19.5L19 22L18 19.5L15.5 18.5L18 17.5L19 15Z" />
  </svg>
);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "model",
      text: "Xin chào! 👋 Tôi là **Trợ lý AI Mua Sắm** của cửa hàng.\n\nTôi có thể giúp bạn:\n- 🛋️ **Tư vấn & đề xuất sản phẩm** theo nhu cầu và không gian phòng\n- 🔄 **Giải đáp chính sách đổi trả hàng trong 7 ngày**\n- 🛡️ **Thông tin bảo hành 12 - 24 tháng**\n- 🚚 **Phí vận chuyển và thời gian giao hàng**\n\nBạn đang quan tâm đến sản phẩm nào hoặc cần hỗ trợ gì ạ?",
      quickQuestions: [
        "Chính sách đổi trả hàng?",
        "Chính sách bảo hành sản phẩm?",
        "Gợi ý sofa phòng khách",
        "Đơn bao nhiêu được Free Ship?",
      ],
      suggestedProducts: [],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => !!state.auth.token);
  const token = useSelector((state) => state.auth.token);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Tải danh sách câu hỏi gợi ý từ Backend
  useEffect(() => {
    getQuickQuestions().then((questions) => {
      if (questions && questions.length > 0) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === "welcome" ? { ...msg, quickQuestions: questions } : msg
          )
        );
      }
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages]);

  // Handle sending a message
  const handleSend = async (customText = null) => {
    const textToSend = (customText !== null ? customText : inputValue).trim();
    if (!textToSend || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      text: textToSend,
    };

    // Add user message to UI immediately
    setMessages((prev) => [...prev, userMessage]);
    if (customText === null) {
      setInputValue("");
    }
    setIsLoading(true);

    try {
      // Build conversation history for API
      const historyPayload = messages
        .filter((m) => m.id !== "welcome")
        .slice(-6)
        .map((m) => ({
          role: m.role === "user" ? "user" : "model",
          text: m.text,
        }));

      const res = await sendMessageToBot(textToSend, historyPayload);

      const botMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: res.reply || "Tôi đã nhận được câu hỏi của bạn. Hãy liên hệ với chúng tôi nếu cần thêm thông tin nhé!",
        suggestedProducts: res.suggestedProducts || [],
        quickQuestions: res.quickQuestions || [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn cho bot:", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: "Xin lỗi, hiện tại hệ thống kết nối AI đang bận. Bạn vui lòng thử lại sau ít giây hoặc gọi hotline **1900 8888** để được hỗ trợ tức thì nhé! 🙏",
        suggestedProducts: [],
        quickQuestions: [
          "Chính sách đổi trả hàng?",
          "Chính sách bảo hành?",
          "Gợi ý sản phẩm nổi bật",
        ],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Add to cart from suggested product card
  const handleAddToCart = async (product, e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      navigate("/login");
      return;
    }

    try {
      toast.success(`Đã thêm "${product.name}" vào giỏ hàng! 🛒`);
      const response = await addToCartService(product.id, token);
      const { productsInCart } = response.data;
      const totalQuantity = productsInCart.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      dispatch(cartActions.setTotalQuantity(totalQuantity));
    } catch (error) {
      console.error("Lỗi thêm vào giỏ hàng từ chatbot:", error);
    }
  };

  // Format message text with basic markdown (bold, lists, code, line breaks)
  const renderFormattedText = (content) => {
    if (!content) return null;

    const lines = content.split("\n");
    return lines.map((line, idx) => {
      // Bold text formatting **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);

      const parsedLine = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.trim().startsWith("- ") || line.trim().startsWith("+ ")) {
        return (
          <div key={idx} className="chatbot__list-item">
            <span className="chatbot__bullet">•</span>
            <span>{parsedLine}</span>
          </div>
        );
      }

      if (line.trim() === "") {
        return <div key={idx} className="chatbot__empty-line" />;
      }

      return (
        <p key={idx} className="chatbot__text-line">
          {parsedLine}
        </p>
      );
    });
  };

  return (
    <div className="chatbot__container">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          className="chatbot__trigger-btn"
          onClick={() => setIsOpen(true)}
          title="Trợ lý AI tư vấn mua sắm"
          aria-label="Open AI Chatbot"
        >
          <div className="chatbot__trigger-icon">
            <AIIcon size={18} />
          </div>
          <div className="chatbot__trigger-content">
            <span className="chatbot__trigger-title">Trợ lý AI</span>
            <span className="chatbot__trigger-subtitle">Hỏi đáp & Đổi trả</span>
          </div>
          {hasUnread && <span className="chatbot__unread-dot"></span>}
        </button>
      )}

      {/* Main Chat Window */}
      {isOpen && (
        <div className="chatbot__window">
          {/* Header */}
          <div className="chatbot__header">
            <div className="chatbot__header-info">
              <div className="chatbot__avatar-wrapper">
                <div className="chatbot__avatar">
                  <AIIcon size={20} />
                </div>
                <span className="chatbot__status-dot"></span>
              </div>
              <div>
                <div className="chatbot__title">Trợ lý AI Mua Sắm</div>
                <div className="chatbot__subtitle">Trực tuyến • Hỗ trợ 24/7</div>
              </div>
            </div>
            <div className="chatbot__header-actions">
              <button
                className="chatbot__action-btn"
                onClick={() => setIsOpen(false)}
                title="Đóng chat"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="chatbot__body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chatbot__msg-row ${
                  msg.role === "user" ? "chatbot__msg-row--user" : "chatbot__msg-row--bot"
                }`}
              >
                {msg.role === "model" && (
                  <div className="chatbot__bot-icon">
                    <i className="ri-sparkling-fill"></i>
                  </div>
                )}

                <div className="chatbot__msg-wrapper">
                  <div
                    className={`chatbot__msg-bubble ${
                      msg.role === "user"
                        ? "chatbot__msg-bubble--user"
                        : "chatbot__msg-bubble--bot"
                    }`}
                  >
                    {renderFormattedText(msg.text)}
                  </div>

                  {/* Render Suggested Products Carousel / Cards */}
                  {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                    <div className="chatbot__products-section">
                      <div className="chatbot__products-title">
                        <i className="ri-shopping-bag-3-line"></i> Sản phẩm đề xuất cho bạn:
                      </div>
                      <div className="chatbot__products-grid">
                        {msg.suggestedProducts.map((p) => {
                          const imgSrc = (p.imageUrl || "/noavatar.png").replace(
                            /^http:\/\//i,
                            "https://"
                          );
                          return (
                            <div
                              key={p.id}
                              className="chatbot__product-card"
                              onClick={() => navigate(`/shop/${p.id}`)}
                            >
                              <div className="chatbot__product-img-box">
                                <img
                                  src={imgSrc}
                                  alt={p.name}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80";
                                  }}
                                />
                                {p.category && (
                                  <span className="chatbot__product-cat">
                                    {p.category}
                                  </span>
                                )}
                              </div>
                              <div className="chatbot__product-info">
                                <h5 className="chatbot__product-name" title={p.name}>
                                  {p.name}
                                </h5>
                                <div className="chatbot__product-meta">
                                  <span className="chatbot__product-price">
                                    {p.price.toLocaleString("vi-VN")} đ
                                  </span>
                                  {p.rating && (
                                    <span className="chatbot__product-rating">
                                      ⭐ {p.rating}
                                    </span>
                                  )}
                                </div>
                                <div className="chatbot__product-btns">
                                  <button
                                    type="button"
                                    className="chatbot__btn-view"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/shop/${p.id}`);
                                    }}
                                  >
                                    Xem chi tiết
                                  </button>
                                  <button
                                    type="button"
                                    className="chatbot__btn-cart"
                                    onClick={(e) => handleAddToCart(p, e)}
                                    title="Thêm vào giỏ hàng"
                                  >
                                    <i className="ri-shopping-cart-line"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Render Quick Chips / Follow-up Questions */}
                  {msg.quickQuestions && msg.quickQuestions.length > 0 && (
                    <div className="chatbot__chips-wrapper">
                      {msg.quickQuestions.map((chip, cIdx) => (
                        <button
                          key={cIdx}
                          type="button"
                          className="chatbot__chip"
                          disabled={isLoading}
                          onClick={() => handleSend(chip)}
                        >
                          <i className="ri-chat-smile-2-line"></i>
                          <span>{chip}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="chatbot__msg-row chatbot__msg-row--bot">
                <div className="chatbot__bot-icon">
                  <i className="ri-sparkling-fill"></i>
                </div>
                <div className="chatbot__msg-bubble chatbot__msg-bubble--bot chatbot__typing-bubble">
                  <span className="chatbot__typing-dot"></span>
                  <span className="chatbot__typing-dot"></span>
                  <span className="chatbot__typing-dot"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="chatbot__footer">
            <div className="chatbot__input-box">
              <input
                ref={inputRef}
                type="text"
                className="chatbot__input"
                placeholder="Hỏi về sản phẩm, chính sách đổi trả, ship..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                type="button"
                className={`chatbot__send-btn ${
                  inputValue.trim() && !isLoading ? "chatbot__send-btn--active" : ""
                }`}
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isLoading}
                title="Gửi tin nhắn"
              >
                <i className="ri-send-plane-2-fill"></i>
              </button>
            </div>
            <div className="chatbot__footer-note">
              <span>Được hỗ trợ bởi AI RAG • Tư vấn chính xác chính sách cửa hàng</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
