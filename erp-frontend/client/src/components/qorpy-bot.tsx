import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Bot,
  X,
  Send,
  Loader2,
  Sparkles,
  TrendingUp,
  Receipt,
  Users,
  PiggyBank,
  Building2,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

interface QorpyBotProps {
  moduleColor?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface QuickAction {
  icon: React.ElementType;
  label: string;
  prompt: string;
}

const quickActions: QuickAction[] = [
  { icon: TrendingUp, label: "Sales Summary", prompt: "Show me today's sales summary" },
  { icon: Receipt, label: "Pending Expenses", prompt: "What expenses need my approval?" },
  { icon: Users, label: "Staff Overview", prompt: "Give me a staff attendance overview" },
  { icon: PiggyBank, label: "Budget Status", prompt: "How are we doing on our budgets?" },
  { icon: Building2, label: "Asset Report", prompt: "Show me the asset depreciation report" },
  { icon: HelpCircle, label: "Help", prompt: "What can you help me with?" },
];

// Simulated AI responses based on context
const generateResponse = async (message: string): Promise<string> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));

  const lowerMessage = message.toLowerCase();

  // Sales related
  if (lowerMessage.includes("sales") || lowerMessage.includes("revenue")) {
    return `📊 **Today's Sales Summary**

Here's your sales performance for today:

| Metric | Value |
|--------|-------|
| Total Sales | ₦2,450,000 |
| Orders | 23 |
| Average Order | ₦106,521 |
| Top Product | Premium Package |

**Trend:** Sales are up 12% compared to yesterday. Your top performing channel is direct sales.

Would you like me to show you a detailed breakdown by product or customer segment?`;
  }

  // Expenses related
  if (lowerMessage.includes("expense") || lowerMessage.includes("approval")) {
    return `📋 **Pending Expense Approvals**

You have **3 expenses** awaiting your approval:

1. **Office Supplies** - ₦45,000
   Submitted by: Adaora Nwachukwu
   Date: Today, 10:30 AM

2. **Transportation** - ₦28,500
   Submitted by: Chidi Okonkwo
   Date: Yesterday, 4:15 PM

3. **Client Entertainment** - ₦150,000
   Submitted by: Funke Adeyemi
   Date: 2 days ago

Would you like me to navigate you to the Expenses page to review these?`;
  }

  // Staff/Attendance related
  if (lowerMessage.includes("staff") || lowerMessage.includes("attendance") || lowerMessage.includes("employee")) {
    return `👥 **Staff Attendance Overview**

Today's attendance status:

| Status | Count |
|--------|-------|
| Present | 42 |
| Remote | 8 |
| On Leave | 3 |
| Absent | 2 |

**Highlights:**
- Overall attendance rate: 91%
- 2 employees haven't clocked in yet (might be late)
- 3 employees are on approved annual leave

Need details on any specific employee or department?`;
  }

  // Budget related
  if (lowerMessage.includes("budget")) {
    return `💰 **Budget Status Report**

Here's your current budget performance:

| Category | Budget | Spent | Remaining |
|----------|--------|-------|-----------|
| Operations | ₦5M | ₦3.2M | ₦1.8M (36%) |
| Marketing | ₦2M | ₦1.8M | ₦200K (10%) ⚠️ |
| IT & Software | ₦1.5M | ₦800K | ₦700K (47%) |
| Travel | ₦500K | ₦520K | -₦20K 🔴 |

**Alert:** Marketing budget is nearly exhausted and Travel has exceeded allocation by ₦20,000.

Would you like me to help you adjust these budgets or review the overspending?`;
  }

  // Asset related
  if (lowerMessage.includes("asset") || lowerMessage.includes("depreciation")) {
    return `🏢 **Asset Depreciation Report**

Current asset portfolio summary:

| Metric | Value |
|--------|-------|
| Total Assets | 47 |
| Purchase Value | ₦45,200,000 |
| Current Value | ₦32,640,000 |
| Total Depreciation | ₦12,560,000 (28%) |

**Top Depreciating Categories:**
1. Computer Equipment: 33% depreciated
2. Motor Vehicles: 25% depreciated
3. Office Equipment: 20% depreciated

3 assets are approaching full depreciation and may need replacement planning.

Want me to show you the full asset register?`;
  }

  // Help/capabilities
  if (lowerMessage.includes("help") || lowerMessage.includes("what can you")) {
    return `👋 **Hi! I'm Qorpy, your ERP assistant.**

I can help you with:

🔹 **Sales & Revenue**
   - Daily/weekly/monthly sales reports
   - Top products and customers
   - Revenue trends and forecasts

🔹 **Expense Management**
   - View pending approvals
   - Expense summaries by category
   - Budget vs actual spending

🔹 **HR & Attendance**
   - Staff attendance overview
   - Leave balances and requests
   - Payroll summaries

🔹 **Budgeting**
   - Budget status and alerts
   - Spending analysis
   - Budget recommendations

🔹 **Assets**
   - Asset register overview
   - Depreciation reports
   - Maintenance schedules

Just ask me anything in plain English, and I'll help you find the information you need!`;
  }

  // Greetings
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
    return `👋 Hello! I'm **Qorpy**, your intelligent ERP assistant.

How can I help you today? You can ask me about:
- Sales and revenue performance
- Pending expense approvals
- Staff attendance
- Budget status
- Asset reports

Or just tell me what you're looking for!`;
  }

  // Thank you
  if (lowerMessage.includes("thank")) {
    return `You're welcome! 😊

Is there anything else I can help you with? I'm here to make managing your business easier.`;
  }

  // Default response
  return `I understand you're asking about "${message}".

While I'm still learning about all aspects of your business, here are some things I can definitely help with:

📊 **Quick Reports**
- "Show me today's sales"
- "What's my budget status?"
- "How many staff are present?"

📋 **Task Management**
- "What needs my approval?"
- "Show pending expenses"

💡 **Insights**
- "Asset depreciation report"
- "Revenue trends"

Try one of these, or rephrase your question and I'll do my best to help!`;
};

export function QorpyBot({ moduleColor = "#4B6BF5" }: QorpyBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isTyping) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await generateResponse(text);
      const assistantMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (prompt: string) => {
    handleSend(prompt);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const botContent = (
    <>
      {/* Floating Bot Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed z-[9999] h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center text-white",
          isOpen && "scale-0 opacity-0"
        )}
        style={{
          bottom: "24px",
          right: "24px",
          position: "fixed",
          backgroundColor: moduleColor,
          boxShadow: `0 10px 25px ${moduleColor}40`,
        }}
      >
        <Bot className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed z-[9999] w-[380px] max-w-[calc(100vw-3rem)] bg-background border border-border rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden",
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        )}
        style={{ bottom: "24px", right: "24px", height: "min(600px, calc(100vh - 6rem))", position: "fixed" }}
      >
        {/* Header */}
        <div
          className="h-16 text-white flex items-center justify-between px-4"
          style={{ backgroundColor: moduleColor }}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Qorpy Assistant</h3>
              <p className="text-xs opacity-80">AI-powered ERP helper</p>
            </div>
          </div>
          <button
            className="h-9 w-9 rounded-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ height: "calc(100% - 64px - 72px)" }}
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div
                className="h-16 w-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${moduleColor}15` }}
              >
                <Bot className="h-8 w-8" style={{ color: moduleColor }} />
              </div>
              <h4 className="font-semibold text-lg mb-2">Welcome to Qorpy!</h4>
              <p className="text-sm text-muted-foreground mb-6">
                I'm your AI assistant. Ask me anything about your business data.
              </p>

              {/* Quick Actions */}
              <div className="w-full grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.prompt)}
                    className="flex items-center gap-2 p-3 text-left text-sm rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    <action.icon className="h-4 w-4 flex-shrink-0" style={{ color: moduleColor }} />
                    <span className="truncate">{action.label}</span>
                    <ChevronRight className="h-3 w-3 ml-auto text-muted-foreground flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                      message.role === "user"
                        ? "text-white rounded-br-md"
                        : "bg-muted rounded-bl-md"
                    )}
                    style={message.role === "user" ? { backgroundColor: moduleColor } : undefined}
                  >
                    {message.role === "assistant" ? (
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                        dangerouslySetInnerHTML={{
                          __html: message.content
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                            .replace(/\n/g, "<br />")
                            .replace(
                              /\| (.*?) \|/g,
                              '<span class="inline-block font-mono text-xs">$1</span>'
                            ),
                        }}
                      />
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full animate-bounce" style={{ backgroundColor: `${moduleColor}99`, animationDelay: "0ms" }} />
                      <div className="h-2 w-2 rounded-full animate-bounce" style={{ backgroundColor: `${moduleColor}99`, animationDelay: "150ms" }} />
                      <div className="h-2 w-2 rounded-full animate-bounce" style={{ backgroundColor: `${moduleColor}99`, animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="h-[72px] border-t border-border p-3 bg-background">
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Qorpy anything..."
              disabled={isTyping}
              className="flex-1 rounded-full bg-muted border-0 focus-visible:ring-1"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: moduleColor }}
            >
              {isTyping ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="text-xs text-muted-foreground hover:text-foreground mt-1 ml-2"
            >
              Clear conversation
            </button>
          )}
        </div>
      </div>
    </>
  );

  // Use portal to render outside the layout container
  return createPortal(botContent, document.body);
}
