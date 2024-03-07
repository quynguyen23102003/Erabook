## `User/Account` model

```ts
{
	_id: string; // id
	_role: "user" | "admin"; // user role, server side only
	_isVerified?: boolean;
	// server side only, may be optional
	// depending on whether verification is required upon registering
	_firebaseRef?: string; // server generated - firebase storage ref, DO NOT TOUCH

	username: string;
	password: string; // not visible on any endpoint
	emailAddress: string;
	createdAt: number; // server generated - account creation timestamp

	avatarUrl?: string; // server generated - user's avatar via file upload
	fullName?: string;
	contactAddress?: string;
	country?: string;
	phoneAddress?: string;
	gender?: "Nam" | "Nữ" | "Khác";
	birthDate?: string;
	ageGroup?: {
		from?: number,
		to?: number
	},

	// user's wish list
	// origin: FavoriteLists - mysql
	wishlist?: {
		bookId: ObjectId; // see BWBook.ts, target book Id
		timestamp: number; // server generated - bookmarked timestamp
	}[];

	// user's reading shelf, DO NOT modify this manually unless you know what you're doing
	// origin: ReadingHistory, ReadLists, PersonalBookshelves - mysql.sql
	// ...same as above
	shelf?: {
		bookId: ObjectId; // see BWBook.ts, target book Id
		lastPage: number; // last viewed page
		timestamp: number; // server generated - viewed timestamp
	}[];

	// user's preferred genres
	preferredGenres?: string[]
}
```

## `GET` **/radmin/accounts/getAll[?search=\<username|emailAddress\>][&limit=\<num\>][&page=\<num\>]**

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

## `GET` **/radmin/accounts/:id/details**

<details>
<summary>Return</summary>
```ts
{
    ...model
}
```
</details>

## `DELETE` **/radmin/accounts/remove**

<details>
<summary>Accept</summary>

```ts
{
    _id: string,
}
```

</details>

## `POST` **/radmin/accounts/create**

Some notes when uploading avatars:

-   use `FormData` for your request body
-   put the `File` object in a field name `file``

```ts
const formData = new FormData();
formData.append("file", File_object_from_picker); // avatar image file
// append the usual JSON body as following
formData.append("emailAddress", "someAddress@example.com");
formData.append("fullName", "John Doe");
...
```

<details>
<summary>Accept</summary>

```ts
{
    username: string,
    password: string,
    emailAddress: string,
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

## `POST` **/radmin/accounts/update**

Some notes when uploading avatars:

-   use `FormData` for your request body
-   put the `File` object in a field name `file``

```ts
const formData = new FormData();
formData.append("file", File_object_from_picker); // avatar image file
// append the usual JSON body as following
formData.append("emailAddress", "someAddress@example.com");
formData.append("fullName", "John Doe");
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

## `GET` **/radmin/accounts/:userId/activityLog[?limit=\<num\>][&page=\<num\>]**

-   `?limit=<num>` Limit amount of entries returned, default 50

-   `?page=<num>` Pagination

<details>
<summary>Return</summary>

```ts
[
    {
        _id?: string,
        _userId: string,
        _targetId?: string,

        type: string,
        timestamp: number,
        data?: unknown
        ...
    }
]
```

</details>
