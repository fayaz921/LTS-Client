interface DrawerEmptyProps {
    icon: string
    text: string
    btnText: string
    onAdd: () => void
    showBtn?: boolean
}

export default function DrawerEmpty({ icon, text, btnText, onAdd, showBtn = true }: DrawerEmptyProps) {
    return (
        <div className="cdr__empty">
            <div className="cdr__empty-icon">{icon}</div>
            <p className="cdr__empty-text">{text}</p>
            {showBtn && (
                <button className="cdr__add-btn" onClick={onAdd}>{btnText}</button>
            )}
        </div>
    )
}