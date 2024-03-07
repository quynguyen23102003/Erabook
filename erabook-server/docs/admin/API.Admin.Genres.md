## `Genre` model

```ts
{
	_id: string; // id

	name: string; // name of the genre
	description: string; // short description
	// coverImage?: string; // obsolete - server generated - will pick one of the book's with said genre, undefined if no matching books found
}
```

## `GET` **/radmin/genres/getAll[?search=\<name\>][&limit=\<num\>][&page=\<num\>]**

<details>
<summary>Accept</summary>

```ts
[
	{
		...model,
	},
];
```

</details>

## `GET` \*\*/radmin/genres/:id/details

<details>
<summary>Accept</summary>

```ts
{
    ...model
}
```

</details>

## `DELETE` **/radmin/genres/remove**

`Note` This will mark the related books as "removal", hence they will not appear in any list or purchase history except admin's

<details>
<summary>Accept</summary>

```ts
{
    _id: string,
}
```

</details>

## `POST` **/radmin/genres/create**

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

## `POST` **/radmin/genres/update**

<details>
<summary>Accept</summary>

```ts
{
    _id: string,
    ...model
}
```

</details>
