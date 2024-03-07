## `Rating` model

```ts
{
    _id: string,
    _user: { // server generated
        isFavorite: boolean, // whether the current user had this rating in their favorite list
    }

    rating: number, // should be between 1-5, no decimal,
    postDate: number, // server generated, post timestamp
    favorites: number, //  server generated, rating favorite count

    comment?: string, // string comment, if any

    author: { // server generated, user whom owns this rating
        _id: string,
        username: string,
        fullName?: string,
        avatarUrl?: string
    }
}
```

## `GET` **/ratings/:bookId/getAll[?page=\<num\>][&limit=\<num\>][&sort=\<field\>][&asc]**

### Get all ratings of a book

The `:bookId` is a required param - representing the **ID of a book**, passed as part of the URL path.

-   `?page=<num>` Pagination

-   `?limit=<num>` Limit amount of entries returned, default 50

-   `?sort=<field>` Sort by **postDate** or **rating**, default **postDate**

-   `?asc` Sort ascending instead

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

## `GET` **/ratings/:bookId/mine**

### Get current user's rating of this book, if any

The `:bookId` is a required param - representing the **ID of a book**, passed as part of the URL path.

This does not require any data, just listen for the response code for indication whether it was successful or not.

<details>
<summary>Return</summary>

```ts
{
    ...model
}
```

</details>

## `POST` **/ratings/:bookId/create**

### Create a rating for a book

The `:bookId` is a required param - representing the **ID of a book**, passed as part of the URL path.

<details>
<summary>Accept</summary>

```ts
{
    rating: number, // should be between 1-5, no decimal

    comment?: string, // string comment, if any
}
```

</details>

<details>
<summary>Return</summary>

```ts
{
    _id: string, // Id of the created rating
}
```

</details>

## `POST` **/ratings/:bookId/update**

### Update an existing rating

The `:bookId` is a required param - representing the **ID of a book**, passed as part of the URL path.

<details>
<summary>Accept</summary>

```ts
{
    rating: number, // should be between 1-5, no decimal

    comment?: string, // string comment, if any
}
```

</details>

## `GET` **/ratings/:bookId/:ratingId/addFavorite**

### Favorite a rating

The `:bookId` is a required param - representing the **ID of a book**, passed as part of the URL path.

The `:ratingId` is a required param - representing the **ID of a rating**, passed as part of the URL path.

## `GET` **/ratings/:bookId/:ratingId/removeFavorite**

### Remove favorite from a rating

The `:bookId` is a required param - representing the **ID of a book**, passed as part of the URL path.

The `:ratingId` is a required param - representing the **ID of a rating**, passed as part of the URL path.
