function Pagination({count, page, limit, onPageChange}) {

    const numberOfPages = Math.ceil(count / limit)
    const changePage = (e, page) => {
        e.preventDefault()
        onPageChange(page)
    }

    
    let pagesArray = [page - 1, page, page + 1]
    if(page === 1) pagesArray = [1, 2, 3]
    if(page === numberOfPages) pagesArray = [numberOfPages - 2, numberOfPages - 1, numberOfPages]
       
    return (
        <div className="pagination is-centered" role="navigation" aria-label="pagination">
            <button className="pagination-previous" disabled={page === 1} onClick={(e) =>changePage(e, page - 1)}>Previous</button>
            <button className="pagination-next" disabled={page * limit === count } onClick={(e) => changePage(e, page + 1)}>Next page</button>
            <ul className="pagination-list">
                {pagesArray.map((p) => (
                    <li key={p}>
                            <button className={`pagination-link ${(p === page ? 'is-current' : null)}`} aria-label="Page 1" aria-current="page" onClick={(e) =>changePage(e, p)}>{p}</button>
                        </li>     
                ))}
            </ul>
        </div>
    )
}

export default Pagination