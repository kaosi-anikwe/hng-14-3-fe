import { createContext, useContext, useState, useCallback, useRef } from 'react'

type ToastType = 'info' | 'success' | 'warning' | 'error'

interface Toast {
    id: number
    message: string
    type: ToastType
}

interface ToastContextValue {
    toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let nextId = 0

const DURATION = 4000

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])
    const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id))
        const timer = timersRef.current.get(id)
        if (timer) {
            clearTimeout(timer)
            timersRef.current.delete(id)
        }
    }, [])

    const toast = useCallback((message: string, type: ToastType = 'info') => {
        const id = ++nextId
        setToasts(prev => [...prev.slice(-4), { id, message, type }]) // keep max 5
        const timer = setTimeout(() => removeToast(id), DURATION)
        timersRef.current.set(id, timer)
    }, [removeToast])

    const alertClass = (type: ToastType) => {
        switch (type) {
            case 'success': return 'alert-success'
            case 'warning': return 'alert-warning'
            case 'error': return 'alert-error'
            default: return 'alert-soft'
        }
    }

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            {toasts.length > 0 && (
                <div className="toast toast-top toast-center z-9999 max-w-sm">
                    {toasts.map(t => (
                        <div
                            key={t.id}
                            className={`alert ${alertClass(t.type)} shadow-lg cursor-pointer text-sm`}
                            onClick={() => removeToast(t.id)}
                        >
                            <span>{t.message}</span>
                        </div>
                    ))}
                </div>
            )}
        </ToastContext.Provider>
    )
}

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used within ToastProvider')
    return ctx
}
