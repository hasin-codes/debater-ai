"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { PlusCircle, Send, ThumbsUp, ThumbsDown, RotateCcw, Copy, ArrowDown, Image, BarChart2, Lightbulb, FileText, ChevronDown, Check, Menu, Plus, ChevronLeft, ChevronRight, Paperclip, Mic, PanelLeftClose, PenSquare, Hexagon, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

const colors = {
  background: "#010101",
  text: "#fefefe",
  primary: "#c7ff1b",
  primaryHover: "#a6d916",
  secondary: "#181a1b",
  secondaryHover: "#2a2d2e",
  userMessage: "#d3e0d3",
  aiMessage: "#c7ff1b",
  inputShadow: "#c7ff1b",
}

interface Message {
  role: "user" | "ai"
  content: string
}

interface Chat {
  id: number
  title: string
  messages: Message[]
}

export function ChatInterfaceComponent() {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [gptModel, setGptModel] = useState("ChatGPT")
  const [actionStates, setActionStates] = useState<Record<string, boolean>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [planType, setPlanType] = useState("Personal")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    setSidebarOpen(!isMobile)
    setIsInitialLoad(false)
  }, [isMobile])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    setShowScrollButton(scrollTop < scrollHeight - clientHeight - 100)
  }

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = { role: "user", content: inputValue }
      if (!currentChat) {
        const newChat: Chat = {
          id: chats.length + 1,
          title: `New Chat ${chats.length + 1}`,
          messages: [newMessage]
        }
        setChats([newChat, ...chats])
        setCurrentChat(newChat)
        setMessages([newMessage])
      } else {
        setMessages([...messages, newMessage])
        setChats(chats.map(chat => 
          chat.id === currentChat.id 
            ? { ...chat, messages: [...chat.messages, newMessage] }
            : chat
        ))
      }
      setInputValue("")
      setIsGenerating(true)
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = { role: "ai", content: "This is a simulated AI response to your message." }
        setMessages(prevMessages => [...prevMessages, aiResponse])
        setChats(prevChats => prevChats.map(chat => 
          chat.id === (currentChat ? currentChat.id : prevChats[0].id)
            ? { ...chat, messages: [...chat.messages, aiResponse] }
            : chat
        ))
        setIsGenerating(false)
      }, 2000)
    }
  }

  const createNewChat = () => {
    if (messages.length > 0) {
      const newChat: Chat = {
        id: chats.length + 1,
        title: `New Chat ${chats.length + 1}`,
        messages: []
      }
      setChats([newChat, ...chats])
      setCurrentChat(newChat)
      setMessages([])
      if (isMobile) {
        setSidebarOpen(false)
      }
    }
  }

  const selectChat = (chat: Chat) => {
    setCurrentChat(chat)
    setMessages(chat.messages)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const regenerateResponse = () => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'ai') {
      const newResponse: Message = { role: "ai", content: "This is a regenerated AI response." }
      setMessages(prevMessages => [...prevMessages.slice(0, -1), newResponse])
      if (currentChat) {
        setChats(prevChats => prevChats.map(chat => 
          chat.id === currentChat.id 
            ? { ...chat, messages: [...chat.messages.slice(0, -1), newResponse] }
            : chat
        ))
      }
    }
  }

  const toggleActionState = (messageIndex: number, action: string) => {
    setActionStates(prevStates => ({
      ...prevStates,
      [`${messageIndex}-${action}`]: !prevStates[`${messageIndex}-${action}`]
    }))
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: colors.background, color: colors.text }}>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={isInitialLoad ? false : { x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed md:relative z-20 h-full p-6 overflow-y-auto flex flex-col`}
            style={{ backgroundColor: colors.secondary, width: isMobile ? "80%" : "280px" }}
          >
            <div className="flex justify-between items-center mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-md" 
                style={{ color: colors.text }}
                onClick={() => setSidebarOpen(false)}
              >
                <PanelLeftClose className="h-7.2 w-7.2" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-md"
                style={{ color: colors.primary }}
                onClick={createNewChat}
                disabled={messages.length === 0}
              >
                <PenSquare className="h-7.2 w-7.2" />
              </Button>
            </div>
            <ScrollArea className="flex-grow">
              <div className="space-y-2">
                {chats.map(chat => (
                  <Button 
                    key={chat.id} 
                    variant="ghost" 
                    className={`w-full justify-start text-[#fefefe] hover:bg-[#333333] rounded-md ${
                      isMobile ? "px-2" : "px-4"
                    }`}
                    style={{ color: colors.text }}
                    onClick={() => {
                      selectChat(chat)
                      if (isMobile) setSidebarOpen(false)
                    }}
                  >
                    {isMobile ? (
                      <div className="w-8 h-8 rounded-full bg-[#c7ff1b] flex items-center justify-center text-black">
                        {chat.title.charAt(0)}
                      </div>
                    ) : (
                      chat.title
                    )}
                  </Button>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-auto pt-4">
              <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-[#fefefe] hover:bg-[#333333] rounded-md"
                    style={{ color: colors.text }}
                  >
                    <div className="flex flex-col items-start">
                      <div className="flex items-center">
                        <Hexagon className="mr-2 h-5 w-5" />
                        Upgrade plan
                      </div>
                      <span className="text-xs text-muted-foreground ml-7">More access to the best models</span>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]" style={{ backgroundColor: colors.background, color: colors.text }}>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Upgrade your plan</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant={planType === "Personal" ? "default" : "outline"}
                        onClick={() => setPlanType("Personal")}
                        className="w-full"
                      >
                        Personal
                      </Button>
                      <Button
                        variant={planType === "Business" ? "default" : "outline"}
                        onClick={() => setPlanType("Business")}
                        className="w-full"
                      >
                        Business
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-bold mb-2">Free</h3>
                        <p className="text-2xl font-bold mb-2">$0<span className="text-sm font-normal">/month</span></p>
                        <p className="text-sm mb-4">Explore how AI can help you with everyday tasks</p>
                        <Button variant="outline" className="w-full" disabled>Your current plan</Button>
                        <ul className="mt-4 space-y-2 text-sm">
                          <li className="flex items-center"><Check className="mr-2 h-4 w-4" /> Assistance with writing, problem solving and more</li>
                          <li className="flex items-center"><Check className="mr-2 h-4 w-4" /> Access to GPT-4o mini</li>
                          <li className="flex items-center"><Check className="mr-2 h-4 w-4" /> Limited access to GPT-4o</li>
                        </ul>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h3 className="font-bold mb-2">Plus</h3>
                        <p className="text-2xl font-bold mb-2">$20<span className="text-sm font-normal">/month</span></p>
                        <p className="text-sm mb-4">Boost your productivity with expanded access</p>
                        <Button variant="default" className="w-full">Upgrade to Plus</Button>
                        <ul className="mt-4 space-y-2 text-sm">
                          <li className="flex items-center"><Check className="mr-2 h-4 w-4" /> Everything in Free</li>
                          <li className="flex items-center"><Check className="mr-2 h-4 w-4" /> Access to GPT-4, GPT-4o mini, GPT-4</li>
                          <li className="flex items-center"><Check className="mr-2 h-4 w-4" /> Up to 5x more messages for GPT-4o</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-10 border-b" style={{ backgroundColor: `${colors.background}30`, backdropFilter: "blur(8px)" }}>
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-md"
                style={{ color: colors.text }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="rounded-md ml-2 bg-transparent border-none hover:bg-secondary"
                    style={{ color: colors.text }}
                  >
                    {gptModel} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent style={{ backgroundColor: colors.secondary, color: colors.text }}>
                  <DropdownMenuItem onClick={() => setGptModel("ChatGPT Plus")} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 mr-2 bg-yellow-400 rounded-full"></div>
                      ChatGPT Plus
                    </div>
                    <Button variant="outline" size="sm">Upgrade</Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setGptModel("ChatGPT")} className="flex items-center">
                    <div className="w-4 h-4 mr-2 bg-green-400 rounded-full"></div>
                    ChatGPT
                    <Check className="ml-auto h-4 w-4" />
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex  items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 mr-2 bg-blue-400 rounded-full"></div>
                      Temporary chat
                    </div>
                    <Switch />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6" onScrollCapture={handleScroll} ref={scrollAreaRef}>
          {currentChat || messages.length > 0 ? (
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`flex flex-col mb-4 ${
                    message.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-start max-w-[80%]">
                    {message.role === "ai" && (
                      <Avatar className="mr-4">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-2xl p-4 ${
                        message.role === "user"
                          ? "bg-[#d3e0d3] text-black"
                          : "bg-[#c7ff1b] text-black"
                      }`}
                      style={{ backgroundColor: message.role === "user" ? colors.userMessage : colors.aiMessage, color: colors.background }}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="ml-4">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  {message.role === "ai" && (
                    <div className="flex space-x-2 mt-2 ml-14">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-md hover:bg-[#333333]"
                        style={{ color: colors.text }}
                        onClick={() => toggleActionState(index, 'thumbsUp')}
                      >
                        <ThumbsUp className={`h-4 w-4 ${actionStates[`${index}-thumbsUp`] ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-md hover:bg-[#333333]"
                        style={{ color: colors.text }}
                        onClick={() => toggleActionState(index, 'thumbsDown')}
                      >
                        <ThumbsDown className={`h-4 w-4 ${actionStates[`${index}-thumbsDown`] ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-md hover:bg-[#333333]"
                        style={{ color: colors.text }}
                        onClick={regenerateResponse}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-md hover:bg-[#333333]"
                        style={{ color: colors.text }}
                        onClick={() => toggleActionState(index, 'copy')}
                      >
                        {actionStates[`${index}-copy`] ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-3xl font-bold mb-8">What can I help with?</h2>
              <div className="grid grid-cols-2 gap-4 max-w-2xl">
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center justify-center gap-2 p-6 rounded-md bg-secondary hover:bg-secondary-hover"
                  style={{ color: colors.text }}
                >
                  <Image className="h-8 w-8" />
                  Create image
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center justify-center gap-2 p-6 rounded-md bg-secondary hover:bg-secondary-hover"
                  style={{ color: colors.text }}
                >
                  <BarChart2 className="h-8 w-8" />
                  Analyze data
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center justify-center gap-2 p-6 rounded-md bg-secondary hover:bg-secondary-hover"
                  style={{ color: colors.text }}
                >
                  <Lightbulb className="h-8 w-8" />
                  Brainstorm
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center justify-center gap-2 p-6 rounded-md bg-secondary hover:bg-secondary-hover"
                  style={{ color: colors.text }}
                >
                  <FileText className="h-8 w-8" />
                  Summarize text
                </Button>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>

        {showScrollButton && (
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-20 right-4 rounded-md bg-primary hover:bg-primary-hover"
            style={{ color: colors.background }}
            onClick={scrollToBottom}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        )}

        <div className="p-6" style={{ backgroundColor: colors.background }}>
          <div className="flex items-center space-x-2 relative">
            <div className="relative flex-1">
              <Paperclip className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message ChatGPT..."
                className="w-full border-none text-[#fefefe] focus:ring-0 rounded-md p-4 pl-12 pr-12 outline-none resize-none transition-all duration-300 ease-in-out"
                style={{
                  backgroundColor: colors.secondary,
                  color: colors.text,
                  boxShadow: inputValue ? `0 0 10px ${colors.inputShadow}` : 'none',
                }}
                rows={1}
              />
              <Mic className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <Button 
              onClick={handleSend} 
              className="rounded-md bg-primary hover:bg-primary-hover"
              style={{ color: colors.background }}
            >
              {isGenerating ? (
                <div className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <div className="flex justify-between items-center mt-2 text-xs" style={{ color: colors.text }}>
            <p>ChatGPT can make mistakes. Consider checking important information.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
