import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { cartActions } from "../../redux/slices/cartSlice";
import { addToCartService } from "../../service/cartService";
import { sendMessageToBot, getQuickQuestions } from "../../service/chatbotService";
import "./chatbot.css";

// Icon SVG Robot AI cao cấp, sắc nét và hiện đại
const RobotIcon = ({ size = 38 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="chatbot__robot-svg"
  >
    <defs>
      <linearGradient id="aiOrbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
      <linearGradient id="aiFaceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
    </defs>
    {/* Outer soft glowing halo */}
    <circle cx="18" cy="18" r="17" fill="url(#aiOrbGrad)" />
    
    {/* Antenna */}
    <path d="M18 10V6.5" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="18" cy="5" r="2.2" fill="#38bdf8" stroke="#ffffff" strokeWidth="0.8" />
    
    {/* Robot Head Body */}
    <rect x="8.5" y="10.5" width="19" height="15" rx="5" fill="url(#aiFaceGrad)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.4" />
    
    {/* Glowing Eyes */}
    <circle cx="13.5" cy="17.5" r="2.2" fill="#38bdf8" />
    <circle cx="22.5" cy="17.5" r="2.2" fill="#38bdf8" />
    {/* Specular highlights */}
    <circle cx="14.2" cy="16.7" r="0.8" fill="#ffffff" />
    <circle cx="23.2" cy="16.7" r="0.8" fill="#ffffff" />
    
    {/* Cheeks */}
    <circle cx="11.2" cy="20.2" r="1.1" fill="#f472b6" opacity="0.85" />
    <circle cx="24.8" cy="20.2" r="1.1" fill="#f472b6" opacity="0.85" />

    {/* Friendly Smile */}
    <path d="M15 21.2C16.2 22.4 19.8 22.4 21 21.2" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" />
    
    {/* Tiny sparkles */}
    <path d="M29 6.5L29.6 8.2L31.5 8.8L29.6 9.4L29 11L28.4 9.4L26.5 8.8L28.4 8.2L29 6.5Z" fill="#fde047" />
    <path d="M5.5 21.5L6 22.8L7.5 23.2L6 23.7L5.5 25L5 23.7L3.5 23.2L5 22.8L5.5 21.5Z" fill="#67e8f9" />
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
          title="Chat với Trợ lý AI E-Commerce"
          aria-label="Open AI Chatbot"
        >
          <div className="chatbot__trigger-glow"></div>
          <div className="chatbot__trigger-icon">
            <RobotIcon size={38} />
          </div>
          <div className="chatbot__trigger-content">
            <div className="chatbot__trigger-badge">
              <span className="chatbot__badge-sparkle">✨</span>
              <span>AI ASSISTANT</span>
              <span className="chatbot__live-dot" title="Đang trực tuyến"></span>
            </div>
            <span className="chatbot__trigger-title">Hỏi về sản phẩm & đổi trả</span>
          </div>
          <div className="chatbot__trigger-chat-icon">
            <i className="ri-chat-smile-2-fill"></i>
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
                  <RobotIcon size={38} />
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
