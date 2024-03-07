## `Book` model

```ts
{
    _id: string,

    title: string,
    description: string,
    pageCount: number,
    chapters?: { // note, the chapter list is only available in single book details
        title: string,
        description?: string,
        pageFrom?: number,
        pageTo?: number,
    }[],

    releaseDate?: number,
    publicationYear?: number,
    reprintYear?: number,
    language?: string,
    edition?: string,
    coverImage?: string,
	price?: number,
	targetAgeGroup?: {
		from?: number;
		to?: number;
	};

    // server-generated fields
    author: {
        _id: string,
        name: string,
        biography: string,
        portrait?: string,
        ...
    },
    genres: [
        {
            _id: string,
            name: string,
            description: string
        },
        {
            ...
        }
    ],
    rating: {
        count: number,
        average: number,
        percentage: {
            1: number,
            2: number,
            3: number,
            4: number,
            5: number,
        }
    },

    chapterCount?: number,
    viewCount?: number,
    purchaseCount?: number,
    createdAt: number,

    _user: { // info about session user, server generated
        isPurchased?: boolean; // show whether user has purchased this book, undefined if none
        hasWishlist?: number; // show the timestamp of when the user added this book entry to their wishlist, undefined if none
        readingState?: {      // reading state, only available once the user view a book page
            lastPage: number, // last viewed page
            timestamp: number // timestamp of last viewed page
        },
        existingRating?: {    // existing user's rating object, if any - same model as API.Rating.md
        // this field is explicitly available in the /details endpoint
            _id: string,
            _user: {
                isFavorite: boolean,
            }

            rating: number,
            postDate: number,
            favorites: number,

            comment?: string,

            author: {
                _id: string,
                username: string,
                fullName?: string,
                avatarUrl?: string
            }
        }
    }
}
```

## `GET` **/books/recent**

### Get a list of recently read books, ordered by last read timestamp, additionally can be filtered by given queries (see /books/search)

<details>
<summary>Return</summary>

```ts
[
    {
        ...model
    },
    {
        ...
    }
]
```

</details>

## `GET` **/books/getWishlist**

### Get a list of wishlisted books, additionally can be filtered by given queries (see /books/search)

<details>
<summary>Return</summary>

```ts
[
    {
        ...model
    },
    {
        ...
    }
]
```

</details>

## `GET` **/books/forYou**

### Get a list of suggested books based on preferred genres, additionally can be filtered by given queries (see /books/search)

<details>
<summary>Return</summary>

```ts
[
    {
        ...model
    },
    {
        ...
    }
]
```

</details>

## `GET` **/books/topFree**

### Get a list of books, price must be null or 0, ordered by view count, additionally can be filtered by given queries (see /books/search)

<details>
<summary>Return</summary>

```ts
[
    {
        ...model
    },
    {
        ...
    }
]
```

</details>

## `GET` **/books/topSelling**

### Get a list of books, price must be greater than 0, ordered by view count, additionally can be filtered by given queries (see /books/search)

<details>
<summary>Return</summary>

```ts
[
    {
        ...model
    },
    {
        ...
    }
]
```

</details>

## `GET` **/books/topAll**

### Get a list of books, ordered by view count, additionally can be filtered by given queries (see /books/search)

<details>
<summary>Return</summary>

```ts
[
    {
        ...model
    },
    {
        ...
    }
]
```

</details>

## `GET` **/books/topNewRelease**

### Get a list of books, createdAt must be less than `Date.now() - 3600e3 * 24 * 7` (1 week old), ordered by view count, additionally can be filtered by given queries (see /books/search)

<details>
<summary>Return</summary>

```ts
[
    {
        ...model
    },
    {
        ...
    }
]
```

</details>

## `GET` **/books/search[?search=\<name\>][&genre=\<id\>][&page=\<num\>][&sort=\<field\>][&asc=y][&limit=\<max\>][&filter=type1><=value1,type2><=value2,...]**

### Get a list of books, additionally can be filtered by given queries

-   `?genre=<id>` or `?g=<id>` query is additional for looking up books based on given genre ID.

-   `?page=<num>` or `?p=<num>` query is additional for pagination, if not defined, will limit to first 50 entries.

-   `?search=<name>` or `?s=<name>` query is additional for looking up books based on their titles.

-   `?sort=<field>` query is additional for sorting books based on given field. Currently available sorting fields:

    -   title (default)
    -   lastUpdated
    -   createdAt
    -   viewCount
    -   pageCount
    -   price

-   `?asc=y` query is additional for sorting in ascending order instead of descending by default.

-   `?limit=<max>` query is additional for limiting maximum amount of entries to return.

- `?filter=[type><=value,...]` query is a query contains an array of filtering options, separated by commas. Currently available filtering fields:
    - price
    - rating
    - pageCount
    - purchaseCount


- Example `?filter` usages:
    - `?filter=price=5` price must equal to 5
    - `?filter=price>=10,rating>=3` price must be >= 10 AND rating must be>= to 3
    - `?filter=rating>=3,rating<=5` rating must be >= 3 AND <= 5


If no `genre` or `search` query specified, this will return default book list sorted by title.

<details>
<summary>Return</summary>

```ts
[
    {
        ...model
    },
    {
        ...
    }
]
```

</details>

## `GET` **/books/:bookId/details**

### Get a book details

The `:bookId` is a required param - representing the **ID of a book**, passed as part of the URL path.

<details>
<summary>Return</summary>

```ts
{
    ...model
}
```

</details>

</details>

## `GET` **/books/:bookId/chapters**

### Get all chapters of a book (if any, return empty if chapters not included)

The `:bookId` is a required param - representing the **ID of a book**, passed as part of the URL path.

<details>
<summary>Return</summary>

```ts
{
    title: string,
    chapters: {
        title?: string,
        description?: string,
        pageFrom?: number,
        pageTo?: number
    }[]
}
```

</details>

## `GET` **/books/:bookId/addWishlist**

### Add a book to user's wishlist

The `:bookId` is a required param - representing the **ID of a book**, passed as part of the URL path.

## `GET` **/books/:bookId/removeWishlist**

### Remove a book from user's wishlist

The `:bookId` is a required param - representing the **ID of a book**, passed as part of the URL path.

## `GET` **/books/:bookId/readv2[?page=\<pageIndex\>][&chapter=\<chapterIndex\>]**

### Fetch content of a book

> Note: If the user has the book purchased, return the content of a PDF page in plain text, else this will return a 404 error

> If no chapter or page was specified, this will return the last viewed page or the first page of the book if the user hasn't viewed this book yet.

The `:bookId` is a required param - representing the **ID of a book**, passed as part of the URL path.

The `?chapter=<chapterIndex>` **(1-based index, 1.2.3.4...)** query is for fetching content of the first page of the corresponding chapter.

The `?page=<pageIndex>` **(1-based index, 1.2.3.4...)** query is for fetching a single page of a book, if the book has chapters included, this will return the page corresponding chapter information.

The `chapter` field is only available when the book has chapters included.

### Tại sao lại phải fetch từng trang một thay vì toàn bộ?

-   Này dễ xài hơn
-   Nếu fetch toàn bộ sẽ dẫn tới vấn đề performance ở cả 2 bên server và frontend.
-   Sử dụng cái này cũng không nhất thiết là chậm (**~200ms**, đủ mượt để làm dynamic top/bottom scroll pagination), tại vì mỗi khi request 1 trang, server sẽ cache lại trang đó (mất tầm **~3 giây**) và trang trước cả trang sau (page, page+1, page-1). Mỗi khi request một trang đã có cache thì sẽ nhanh hơn nhiều thay vì phải vọc cái source PDF liên tục.
-   Lưu ý: Cache của một page sẽ tự động xóa sau 2 giờ nếu không có request nào.

<details>
<summary>Return</summary>

```ts
{
    page: {                     // page information
        content: string,        // content of the page
        hasPrev: boolean,       // indicate whether there's a previous page
        hasNext: boolean,       // indicate whether there's a next page
        pageIndex: number       // page position in the book - 1-based index
    },
    chapter?: {                 // chapter information, may return undefined
        title: string,          // chapter title
        description?: string,   // chapter description, if any
        pageFrom?: number,      // chapter starting page, if any
        pageTo?: number,        // chapter ending page, if any
        chapterIndex: number    // chapter position in the book's chapter list - 0-based index, like normal arrays
    }
}
```

</details>

## `Deprecated` `GET` **/books/:bookId/read[?chapter=\<chapter\>][&page=\<page\>][&single=y]**

<details>
<summary>Old reading API</summary>

### Fetch content of a book

> Note: If the user has the book purchased, return the content of a PDF page in plain text, else this will return a 404 error

The `:bookId` is a required param - representing the **ID of a book**, passed as part of the URL path.

The `?chapter=<chapter_index+1>` **(1-index based)** query is for fetching content of a chapter, this will return an array of content from multiple pages.

The `?page=<page_index+1>` **(1-index based)** query is for fetching the exact page of a book, if the book has chapters included, this will return the page corresponding chapter and an array of its content pages, else return a single content page.

The `?single=y` query is for updating the user's reading state of the book. This should goes with the `?page=<page>` query in order to update the user reading state to said page.

The `chapter` field is only available when the book has chapters included.

The `content` field is an array of page content. Will return only one if there's no chapter included.

<!> Note about pagination:

If the pagination `type` is `chapter`:

-   `pageIndex` will be the page index within the chapter pages range (ex: pageIndex is **2** (zero-based, like arrays), and chapter.pageFrom is **1** and chapter.pageTo is **5**, then the actual page number here is **3**). Use this for scrolling to exact page within a chapter.
-   `hasPrev` indicates whether there's a previous chapter
-   `hasNext` indicates whether there's a next chapter

Else if the pagination `type` is `page`:

-   `pageIndex` stands for the exact page number of the book.
-   `hasPrev` indicates whether there's a previous page
-   `hasNext` indicates whether there's a next page

<details>
<summary>Return</summary>

```ts
{
    pagination: {
        type: "chapter" | "page",
        pageIndex: number,
        hasPrev: boolean,
        hasNext: boolean,
    },
    chapter: {
        title?: string,
        description?: string,
        pageFrom?: number,
        pageTo?: number,
    },
    content: string[]
}
```

</details>

</details>
