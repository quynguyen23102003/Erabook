## Response model

```ts
{
    total: number, // results from all-time
    lastDay: number, // results from yesterday
    lastWeek: number, // results from last week
    lastMonth: number, // results from last month
    last6Months: number, // results from last 2 quarters
    lastYear: number // results from last year
}
```

## `GET` **/radmin/statistics/userReadingHistory[?bookId=\<bookd_id\>]**

Get all users book reading statistics of every book or specified by given book ID.

<details>
<summary>Return</summary>

```ts
{
	...model,
}
```

</details>

## `GET` **/radmin/statistics/userRegistrationHistory**

Get all users registration history.

<details>
<summary>Return</summary>

```ts
{
	...model,
}
```

</details>

## `GET` **/radmin/statistics/userPurchaseHistory[?userId=\<user_id\>][&status=success|ongoing|failed]**

Get all purchases of all user or specified by given user ID, filtered by specified status.

<details>
<summary>Return</summary>

```ts
{
	...model,
}
```

</details>

## `GET` **/radmin/statistics/ratingHistory[?bookId=\<book_id\>]**

Get ratings of all books or specified by given book ID.

<details>
<summary>Return</summary>

```ts
{
	...model,
}
```

</details>

## `GET` **/radmin/statistics/bookCreationHistory[?genreId=\<genre_id\>]**

Get books creation history of all genres or specified by given genre ID.

<details>
<summary>Return</summary>

```ts
{
	...model,
}
```

</details>

## `GET` **/radmin/statistics/purchaseHistory[?bookId=\<book_id\>]**

Get purchase history of all books or specified by given book ID.

<details>
<summary>Return</summary>

```ts
{
    total: {
        count: number,
        totalAmount: number,
    },
    lastDay: {
        count: number,
        totalAmount: number,
    },
    lastWeek: {
        count: number,
        totalAmount: number,
    },
    lastMonth: {
        count: number,
        totalAmount: number,
    },
    last6Months: {
        count: number,
        totalAmount: number,
    },
    lastYear: {
        count: number,
        totalAmount: number,
    },
}
```

</details>
