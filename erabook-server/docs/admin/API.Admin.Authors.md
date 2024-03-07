## `Authors` model

```ts
{
	_id: ObjectId; // id
	_firebaseRef?: string; // server generated - firebase storage ref, DO NOT TOUCH

	name: string; // full name or penname

	portrait?: string; // server generated - portrait image via file upload
	biography?: string; // short description
	nationality?: string; // nationality

	// ? unknown purposes / unused
	contactAddress?: string;
	emailAddress?: string;
	phoneNumber?: string;
	birthDate?: string;
}
```

## `GET` **/radmin/authors/getAll[?search=\<name\>][&limit=\<num\>][&page=\<num\>]**

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

## `GET` **/radmin/authors/:id/details**

<details>
<summary>Return</summary>
```ts
{
    ...model
}
```
</details>

## `DELETE` **/radmin/authors/remove**

`Note` This will mark the related books as "removal", hence they will not appear in any list or purchase history except admin's

<details>
<summary>Accept</summary>

```ts
{
    _id: string,
}
```

</details>

## `POST` **/radmin/authors/create**

Some notes when uploading portraits:

-   use `FormData` for your request body
-   put the `File` object in a field name `file``

```ts
const formData = new FormData();
formData.append("file", File_object_from_picker);
...
```

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

## `POST` **/radmin/authors/update**

Some notes when uploading portraits:

-   use `FormData` for your request body
-   put the `File` object in a field name `file``

```ts
const formData = new FormData();
formData.append("file", File_object_from_picker);
...
```

<details>
<summary>Accept</summary>

```ts
{
    _id: string,
    ...model
}
```

</details>
