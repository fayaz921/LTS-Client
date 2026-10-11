interface Props {
    onNewCase: () => void;
}

export default function CasePageHeader({ onNewCase }: Props) {
    return (
        <div className="cl__header">
            <div className="container-xl">
                <div className="cl__header-inner">

                    <div>
                        <ol className="cl__breadcrumb">
                            <li>
                                <a href="#" className="cl__breadcrumb-link">Dashboard</a>
                            </li>
                            <li className="cl__breadcrumb-sep">/</li>
                            <li className="cl__breadcrumb-active">Cases</li>
                        </ol>
                        <div className="cl__title-row">
                            <div className="cl__title-icon">📋</div>
                            <h1 className="cl__title">Cases</h1>
                        </div>
                    </div>

                    <button className="cl__btn-new" onClick={onNewCase}>
                        <span className="cl__btn-new-icon">+</span>
                        File New Case
                    </button>

                </div>
            </div>
        </div>
    );
}
