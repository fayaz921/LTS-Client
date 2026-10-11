import type { ReactNode } from 'react'

interface FuFieldProps {
    num: number
    label: string
    required?: boolean
    optional?: boolean
    children: ReactNode
}

export default function FuField({ num, label, required, optional, children }: FuFieldProps) {
    return (
        <div className="fu-field">
            <label className="fu-label">
                <span className="fu-label-num">{num}</span>
                {label}
                {required && <span className="fu-required">*</span>}
                {optional && <span className="fu-optional">Optional</span>}
            </label>
            {children}
        </div>
    )
}