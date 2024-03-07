import { Document } from "mongodb";
import { BWUser } from "../../models/index.js";

const conditions: { [key: string]: (user: BWUser) => Document[] } = {
	// condition for fetching user reading state of a book
	userGetReadingState: (user: BWUser) => [
		{
			$lookup: {
				from: "BWUsers",
				let: { bid: "$_id" },
				pipeline: [
					{
						$unwind: "$shelf",
					},
					{
						$match: {
							$expr: {
								$and: [
									{
										$eq: ["$shelf.bookId", "$$bid"],
									},
									{
										$eq: ["$_id", user._id],
									},
								],
							},
						},
					},
					{
						$group: {
							_id: "$_id",
							state: {
								$first: "$shelf",
							},
						},
					},
				],
				as: "_readingState",
			},
		},
		{
			$set: {
				_readingState: {
					$first: "$_readingState",
				},
			},
		},
		{
			$set: {
				_user: {
					readingState: "$_readingState.state",
				},
			},
		},
		{
			$unset: ["_readingState", "_user.readingState.bookId"],
		},
	],
	// condition for fetching user purchase state of a book
	userGetPurchaseState: (user: BWUser) => [
		{
			$lookup: {
				from: "BWPurchases",
				let: {
					bid: {
						$toString: "$_id",
					},
				},
				pipeline: [
					{
						$match: {
							$expr: {
								$and: [
									{ $in: ["$$bid", "$_bookIds"] },
									{ $eq: ["$_userId", user._id] },
									{ $eq: ["$status", "success"] },
								],
							},
						},
					},
					{
						$project: {
							_id: 0,
							status: 1,
						},
					},
				],
				as: "_isPurchased",
			},
		},
		{
			$set: {
				_isPurchased: {
					$arrayElemAt: ["$_isPurchased", 0],
				},
			},
		},
		{
			$set: {
				_user: {
					isPurchased: {
						$cond: {
							if: {
								$eq: ["$_isPurchased.status", "success"],
							},
							then: true,
							else: "$$REMOVE",
						},
					},
				},
			},
		},
		{
			$unset: "_isPurchased",
		},
	],
	// condition for fetching user wishlist state of a book
	userGetWishlistState: (user: BWUser) => [
		{
			$lookup: {
				from: "BWUsers",
				let: { bid: "$_id" },
				pipeline: [
					{
						$unwind: "$wishlist",
					},
					{
						$match: {
							$expr: {
								$and: [
									{
										$eq: ["$wishlist.bookId", "$$bid"],
									},
									{
										$eq: ["$_id", user._id],
									},
								],
							},
						},
					},
					{
						$group: {
							_id: "$_id",
							state: {
								$first: "$wishlist",
							},
						},
					},
				],
				as: "_wishlistState",
			},
		},
		{
			$set: {
				_wishlistState: {
					$first: "$_wishlistState",
				},
			},
		},
		{
			$set: {
				_user: {
					hasWishlist: "$_wishlistState.state.timestamp",
				},
			},
		},
		{
			$unset: ["_wishlistState"],
		},
	],
	// condition for fetching user's rating state
	userGetExistingRating: (user: BWUser) => [
		{
			$lookup: {
				from: "BWRatings",
				let: { bid: "$_id" },
				as: "existingRating",
				pipeline: [
					{
						$match: {
							$expr: {
								$and: [
									{ $eq: ["$_bookId", "$$bid"] },
									{ $eq: ["$_userId", user._id] },
								],
							},
						},
					},
					{
						$addFields: {
							favorites: {
								$size: {
									$ifNull: ["$_favorites", []],
								},
							},
						},
					},
					{
						$lookup: {
							from: "BWUsers",
							let: { uid: "$_userId" },
							pipeline: [
								{
									$match: {
										$expr: {
											$eq: ["$_id", "$$uid"],
										},
									},
								},
								{
									$project: {
										_id: 1,
										username: 1,
										fullName: 1,
										avatarUrl: 1,
									},
								},
							],
							as: "author",
						},
					},
					{
						$set: {
							author: {
								$arrayElemAt: ["$author", 0],
							},
						},
					},
					{
						$addFields: {
							_user: {
								isFavorite: {
									$in: [user._id.toString(), { $ifNull: ["$_favorites", []] }],
								},
							},
						},
					},
					{
						$project: {
							_id: 1,
							rating: 1,
							postDate: 1,
							favorites: 1,
							author: 1,
							comment: 1,
							attachments: 1,
							_user: 1,
						},
					},
				],
			},
		},
		{
			$set: {
				_user: {
					existingRating: {
						$first: "$existingRating",
					},
				},
			},
		},
		{
			$project: {
				existingRating: 0,
			},
		},
	],
};

export { conditions as MongoUserConditions };
