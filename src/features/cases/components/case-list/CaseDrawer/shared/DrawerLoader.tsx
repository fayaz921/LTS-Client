export default function DrawerLoader({ text }: { text: string }) {
    return (
        <div className="cdr__loader">
            <div className="cdr__spinner" />
            <p>{text}</p>
        </div>
    )
}