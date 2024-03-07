## `GET` **/account/details**

### Get account details

<details>
<summary>Return</summary>

```ts
{
	_id: string,

	username: string,
	emailAddress: string,
	createdAt: number,

	avatarUrl?: string,
	fullName?: string,
	contactAddress?: string,
	country?: string,
	phoneAddress?: string,
	gender?: "Nam" | "Nữ" | "Khác",
	birthDate?: string,
	ageGroup?: {
		from?: number,
		to?: number
	},

	// user's wish list
	// origin: FavoriteLists - mysql
	wishlist?: {
		bookId: string, // see BWBook.ts,
		timestamp: number,
	}[],

	// user's reading shelf
	// origin: ReadingHistory, ReadLists, PersonalBookshelves - mysql.sql
	shelf?: {
		bookId: string, // see BWBook.ts,
		lastPage: number, // last viewed page
		timestamp: number, // viewed timestamp
	}[],

	// user's preferred genres
	preferredGenres?: string[]
}
```

</details>

## `POST` **/account/update**

### Update account details

Accept any field mentioned in the `/account/details` endpoint

**except these following**:

-   username
-   password
-   createdAt
-   shelf
-   wishlist

<details>
<summary>Accept</summary>

```ts
{
    emailAddress?: string,
    fullName?: string,
    ...
}
```

</details>

Some notes when uploading avatars:

-   use `FormData` for your request body
-   put the `File` object in a field name `file``

```ts
const formData = new FormData();
formData.append("file", File_object_from_picker); // avatar image file
// append the usual JSON body as following
formData.append("emailAddress", "myNewEmailAddress@example.com");
formData.append("fullName", "John Doe");
...
```

## `POST` **/account/updatePassword**

### Update account password

```ts
{
    oldPassword: string, // current password
    newPassword: string  // new password
}
```
