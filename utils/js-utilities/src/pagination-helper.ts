export type Pagination = {
    pageIndex: number
    pageSize: number
}

export class PaginationHelper {
    private static default = {
        maxSize: 100,
        defaultSize: 10,
        defaultPage: 0,
    }

    static PAGINATION_TYPE: Pagination

    static async forController<T>(options: {
        size?: string
        index?: string
        count?: string
        fetcher: (pagination: Pagination) => Promise<T[]>
        counter: () => Promise<number>
    }) {
        const pagination = this.from(options.size, options.index)
        const list = await options.fetcher(pagination)
        return await this.response(
            list,
            pagination,
            options.count === '1' || options.count === 'true' ? options.counter : undefined,
        )
    }

    static from(
        pageSize?: string,
        pageIndex?: string,
        options = PaginationHelper.default,
    ): Pagination {
        const config = { ...this.default, ...options }
        return {
            pageSize: Math.abs(
                Math.min(
                    (pageSize && parseInt(pageSize)) || config.defaultSize || 10,
                    config.maxSize || 100,
                ),
            ),
            pageIndex: Math.abs((pageIndex && parseInt(pageIndex)) || config.defaultPage || 0),
        }
    }

    private static async response<T>(
        list: T[],
        pagination: Pagination,
        counter?: () => Promise<number>,
    ) {
        let total: number | undefined
        let pages: number | undefined
        let result = {
            list,
            size: pagination.pageSize,
            index: pagination.pageIndex,
            total,
            pages,
        }
        if (counter) {
            total = await counter()
            pages = Math.ceil(total / pagination.pageSize)
            result = {
                ...result,
                total,
                pages,
            }
        } else {
            delete result.total
            delete result.pages
        }
        return result
    }
}
