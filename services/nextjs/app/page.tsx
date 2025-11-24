import { TodoApp } from '@/src/widgets/todo-app'
import PasswordModal from '@/src/features/password-auth/ui/PasswordModal'

export default function Home() {
  return (
    <PasswordModal>
      <TodoApp />
    </PasswordModal>
  )
}

