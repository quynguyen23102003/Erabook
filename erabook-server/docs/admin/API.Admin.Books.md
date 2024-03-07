## `Book` model

```ts
{
	_id: string; // id
	_removalTimestamp?: number;
	// marked as removal timestamp, null otherwise
	// if this field exists, the book will not appear in any list or purchase history except admin's
	_sourceFirebaseRef?: string; // server generated - firebase storage ref, DO NOT TOUCH
	_coverFirebaseRef?: string; // server generated - firebase storage ref, DO NOT TOUCH

	_authorId: ObjectId; // see BWAuthor.ts, owning author Id
	_genreIds: string[]; // see BWGenre.ts, list of genre Ids (originally ObjectId[], but MongoDB doesn't store array of ObjectIds, will be converted to string[] instead)
	_sourceUrl: string; // server generated - source material URL in PDF format via file uploading

	title: string; // title
	pageCount: number; // server generated - PDF page count
	description?: string; // short description
	releaseDate?: number;
	publicationYear?: number; // why when there's releaseDate?
	reprintYear?: number;
	language?: string;
	edition?: string;
	coverImage?: string; // server generated - book cover image via file upload
	targetAgeGroup?: {
		from?: number,
		to?: number
	},

	// list of author-defined chapters
	chapters?: {
		title: string; // title, duh
		description?: string; // short description, if any
		pageFrom?: number; // starting page
		pageTo?: number; // ending page
	}[];

	// book pricing
	price?: number;
	// view count
	viewCount?: number;
	// server generated - creation timestamp
	createdAt: number;
}
```

## `GET` **/radmin/books/getAll[?search=\<title\>][&limit=\<num\>][&page=\<num\>][&sort=\<field_name\>][&asc=y]**

-   `&asc=y` for sorting in ascending order instead of descending by default.

-   `&sort=<field>` for sorting entries. Available sorting fields:

    -   createdAt (default)
    -   title
    -   price
    -   pageCount
    -   viewCount
    -   lastUpdated

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

## `GET` **/radmin/books/:id/details**

<details>
<summary>Return</summary>
```ts
{
    ...model
}
```
</details>

## `DELETE` **/radmin/books/remove**

`Note` This will mark the related books as "removal", hence they will not appear in any list or purchase history except admin's

<details>
<summary>Accept</summary>

```ts
{
    _id: string,
}
```

</details>

## `POST` **/radmin/books/create**

`Note` Requires the use of FormData instead

Some notes when uploading source material and cover image:

-   use `FormData` for your request body
-   put the source material `File` object in a field name `sourceFile`
-   put the cover image `File` object in a field name `coverFile`

```ts
const formData = new FormData();
formData.append("sourceFile", File_object_from_picker); // source file
formData.append("coverFile", File_object_from_gallery); // cover image file
// append the usual JSON body as following
formData.append("title", "New Book Title");
formData.append("_authorId", "<24-char ID>");
formData.append("_genreIds", "<24-char ID #1>");
formData.append("_genreIds", "<24-char ID #2>"); // repeat the same field to send an array instead
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

## `POST` **/radmin/books/update**

Some notes when uploading source material and cover image:

-   use `FormData` for your request body
-   put the source material `File` object in a field name `sourceFile`
-   put the cover image `File` object in a field name `coverFile`

```ts
const formData = new FormData();
formData.append("sourceFile", File_object_from_picker); // source file
formData.append("coverFile", File_object_from_gallery); // cover image file
// append the usual JSON body as following
formData.append("title", "New Book Title");
formData.append("_authorId", "<24-char ID>");
formData.append("_genreIds", "<24-char ID #1>");
formData.append("_genreIds", "<24-char ID #2>"); // repeat the same field to send an array instead
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
