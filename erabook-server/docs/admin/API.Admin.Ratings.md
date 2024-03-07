## `Rating` model

```ts
{
	_id: string; // id
	_userId: ObjectId; // see BWUser.ts, target user Id
	_bookId: ObjectId; // see BWBook.ts, target Book Id
	_favorites: string[]; // an array of user IDs that favorited this rating

	rating: number; // scale from 1-5
	postDate: number; // server generated - post date

	comment?: string; // optional comment string
}
```

## `GET` **/radmin/ratings/getAll[?search=\<content\>][&limit=\<num\>][&page=\<num\>]**

<details>
<summary>Return</summary>

```ts
[
	{
		...model,
	},
];
```

</details>

## `GET` **/radmin/ratings/:id/details**

<details>
<summary>Return</summary>
```ts
{
    ...model
}
```
</details>

## `DELETE` **/radmin/ratings/remove**

<details>
<summary>Accept</summary>

```ts
{
    _id: string,
}
```

</details>

## `POST` **/radmin/ratings/update**

<details>
<summary>Accept</summary>

```ts
{
    _id: string,
    ...model
}
```

</details>

## `POST` **/radmin/ratings/create**

<details>
<summary>Accept</summary>

```ts
{
    ...model
}
```

</details>

<details>
<summary>Return</summary>

```ts
{
    _id: string,
}
```

</details>
