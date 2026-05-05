import { useMemo, useState } from 'react'

function SectionPage({ page }) {
    const [keyword, setKeyword] = useState('')

    const filteredRows = useMemo(() => {
        if (!keyword.trim()) return page.rows

        const lower = keyword.trim().toLowerCase()
        return page.rows.filter((row) =>
            row.some((cell) => String(cell).toLowerCase().includes(lower)),
        )
    }, [keyword, page.rows])

    return (
        <div className="admin-page">
            <header className="admin-hero">
                <div>
                    <p className="admin-eyebrow">Trang quản trị</p>
                    <h1>{page.title}</h1>
                    <p className="admin-hero-copy">{page.description}</p>
                </div>
            </header>

            {page.cards?.length > 0 && (
                <section className="admin-summary-grid">
                    {page.cards.map((card) => (
                        <article key={card.label} className="admin-card">
                            <span>{card.label}</span>
                            <strong>{card.value}</strong>
                        </article>
                    ))}
                </section>
            )}

            {page.stats?.length > 0 && (
                <section className="admin-panel">
                    <div className="admin-panel-head">
                        <div>
                            <p className="admin-panel-kicker">Thống kê nhanh</p>
                            <h2>Dữ liệu nổi bật</h2>
                        </div>
                    </div>

                    <div className="admin-mini-grid">
                        {page.stats.map((item) => (
                            <article key={item.name} className="admin-mini-card">
                                <span>{item.name}</span>
                                <strong>{item.value}</strong>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            <section className="admin-panel">
                <div className="admin-panel-head admin-panel-head-wrap">
                    <div>
                        <p className="admin-panel-kicker">Danh sách quản lý</p>
                        <h2>{page.tableTitle}</h2>
                    </div>

                    <div className="admin-toolbar">
                        <input
                            className="admin-search-input"
                            type="text"
                            placeholder="Tìm kiếm dữ liệu..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                </div>

                {page.actions?.length > 0 && (
                    <div className="admin-action-row">
                        {page.actions.map((action) => (
                            <button key={action} type="button" className="admin-table-btn">
                                {action}
                            </button>
                        ))}
                    </div>
                )}

                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                {page.columns.map((col) => (
                                    <th key={col}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.length > 0 ? (
                                filteredRows.map((row, index) => (
                                    <tr key={`${page.title}-${index}`}>
                                        {row.map((cell, cellIndex) => (
                                            <td key={`${index}-${cellIndex}`}>{cell}</td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="admin-empty-cell" colSpan={page.columns.length}>
                                        Không có dữ liệu phù hợp.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}

export default SectionPage