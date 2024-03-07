## `GET` **/authors/getAll[?search=\<name\>][&page=\<num\>][&limit=\<max\>]**

### Get all available authors

<details>
<summary>Return</summary>

```ts
[
    {
        _id?: string;
        name: string;
        biography: string;
        portrait?: string;
        ...
    }
]
```

</details>

## `GET` **/authors/:id/details**

### Get an author details

The `:id` is a required param - representing the **ID of an author**, passed as part of the URL path. Can be filtered by given queries (see [/books/search](./API.Books.md) for more details)

<details>
<summary>Return</summary>

```ts
{
    _id?: string;
    name: string;
    biography: string;
    portrait?: string;
    ...
}
```

</details>

## `GET` **/authors/:id/getAllBooks[?search=\<title\>][&genre=\<id\>][&page=\<num\>][&sort=\<field\>][&asc][&limit=\<max\>]**

### Get all books associated to this author

The `:id` is a required param - representing the **ID of an author**, passed as part of the URL path.

<details>
<summary>Return</summary>

```ts
[
    {
        _id: string,

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

        title: string,
        description: string,
        pageCount: number,
        chapterCount?: number,

        releaseDate?: number,
        publicationYear?: number,
        reprintYear?: number,
        language?: string,
        edition?: string,
        coverImage?: string,
        price?: number,
        viewCount?: number,
        purchaseCount?: number,
        createdAt: number,

        _user: { // info about session user - server generated
            isPurchased?: boolean; // show whether user has purchased this book, undefined if none
            hasWishlist?: number; // show the timestamp of when the user added this book entry to their wishlist, undefined if none
            readingState?: {      // reading state, only available once the user view a book page
                lastPage: number, // last viewed page
                timestamp: number // timestamp of last viewed page
            }
        }
    },
    {
        ...
    }
]
```

</details>
