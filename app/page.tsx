import dynamic from 'next/dynamic'

const ChatInterfaceComponent = dynamic(
  () => import('@/components/chat-interface').then((mod) => mod.ChatInterfaceComponent),
  { ssr: false }
)

export default function Home() {
  return (
    <div className="h-screen">
      <ChatInterfaceComponent />
    </div>
  );
}
