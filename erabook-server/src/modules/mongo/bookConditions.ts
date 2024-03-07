import { Document } from "mongodb";

const conditions: {
	[key: string]: Document[];
} = {
	// condition for filtering books marked for removal
	bookBaseCondition: [
		{
			$match: {
				_removalTimestamp: null,
			},
		},
		{
			$project: {
				_removalTimestamp: 0,
				_sourceFirebaseRef: 0,
				_coverFirebaseRef: 0,
			},
		},
	],
	// condition for fetching book genres
	bookGetGenres: [
		{
			$addFields: {
				_genreIds: {
					$map: {
						input: "$_genreIds",
						as: "e",
						in: {
							$toObjectId: "$$e",
						},
					},
				},
			},
		},
		{
			$lookup: {
				from: "BWGenres",
				localField: "_genreIds",
				foreignField: "_id",
				as: "genres",
			},
		},
		{
			$unset: "_genreIds",
		},
	],
	// condition for fetching book author
	bookGetAuthor: [
		{
			$lookup: {
				from: "BWAuthors",
				localField: "_authorId",
				foreignField: "_id",
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
			$unset: "_authorId",
		},
	],
	// condition for fetching book page count
	bookGetPageCount: [
		// {
		// 	$set: {
		// 		pageCount: {
		// 			$size: "$pages",
		// 		},
		// 	},
		// },
		// {
		// 	$unset: "pages",
		// },
		{
			$unset: "_sourceUrl",
		},
	],
	// condition for getting rating infos
	bookGetRatingInfo: [
		{
			$lookup: {
				from: "BWRatings",
				let: { bid: "$_id" },
				as: "ratings",
				pipeline: [
					{
						$match: {
							$expr: {
								$eq: ["$_bookId", "$$bid"],
							},
						},
					},
					{
						$project: {
							_id: 0,
							rating: 1,
						},
					},
				],
			},
		},
		{
			$set: {
				ratingPercentage: {
					1: {
						$filter: {
							input: "$ratings",
							as: "ratings",
							cond: {
								$eq: ["$$ratings.rating", 1],
							},
						},
					},
					2: {
						$filter: {
							input: "$ratings",
							as: "ratings",
							cond: {
								$eq: ["$$ratings.rating", 2],
							},
						},
					},
					3: {
						$filter: {
							input: "$ratings",
							as: "ratings",
							cond: {
								$eq: ["$$ratings.rating", 3],
							},
						},
					},
					4: {
						$filter: {
							input: "$ratings",
							as: "ratings",
							cond: {
								$eq: ["$$ratings.rating", 4],
							},
						},
					},
					5: {
						$filter: {
							input: "$ratings",
							as: "ratings",
							cond: {
								$eq: ["$$ratings.rating", 5],
							},
						},
					},
				},
			},
		},
		{
			$set: {
				rating: {
					count: {
						$size: "$ratings",
					},
					average: {
						$ifNull: [
							{
								$avg: {
									$map: {
										input: "$ratings",
										as: "ar",
										in: "$$ar.rating",
									},
								},
							},
							0,
						],
					},
					percentage: {
						1: {
							$cond: {
								if: {
									$gt: [{ $size: "$ratings" }, 0],
								},
								then: {
									$multiply: [
										{
											$divide: [
												{ $size: "$ratingPercentage.1" },
												{ $size: "$ratings" },
											],
										},
										100,
									],
								},
								else: 0,
							},
						},
						2: {
							$cond: {
								if: {
									$gt: [{ $size: "$ratings" }, 0],
								},
								then: {
									$multiply: [
										{
											$divide: [
												{ $size: "$ratingPercentage.2" },
												{ $size: "$ratings" },
											],
										},
										100,
									],
								},
								else: 0,
							},
						},
						3: {
							$cond: {
								if: {
									$gt: [{ $size: "$ratings" }, 0],
								},
								then: {
									$multiply: [
										{
											$divide: [
												{ $size: "$ratingPercentage.3" },
												{ $size: "$ratings" },
											],
										},
										100,
									],
								},
								else: 0,
							},
						},
						4: {
							$cond: {
								if: {
									$gt: [{ $size: "$ratings" }, 0],
								},
								then: {
									$multiply: [
										{
											$divide: [
												{ $size: "$ratingPercentage.4" },
												{ $size: "$ratings" },
											],
										},
										100,
									],
								},
								else: 0,
							},
						},
						5: {
							$cond: {
								if: {
									$gt: [{ $size: "$ratings" }, 0],
								},
								then: {
									$multiply: [
										{
											$divide: [
												{ $size: "$ratingPercentage.5" },
												{ $size: "$ratings" },
											],
										},
										100,
									],
								},
								else: 0,
							},
						},
					},
				},
			},
		},
		{
			$unset: ["ratings", "ratingPercentage"],
		},
	],
	// condition for getting chapter count
	bookGetChapterCountKeep: [
		{
			$set: {
				chapterCount: {
					$cond: {
						if: {
							$isArray: "$chapters",
						},
						then: {
							$size: "$chapters",
						},
						else: "$$REMOVE",
					},
				},
			},
		},
	],
	// condition for getting chapter count with removing chapter list
	bookGetChapterCount: [
		{
			$set: {
				chapterCount: {
					$cond: {
						if: {
							$isArray: "$chapters",
						},
						then: {
							$size: "$chapters",
						},
						else: "$$REMOVE",
					},
				},
			},
		},
		{ $unset: "chapters" },
	],
	// condition for counting purchases
	bookGetPurchaseCount: [
		{
			$lookup: {
				from: "BWPurchases",
				let: { bid: "$_id" },
				as: "purchases",
				pipeline: [
					{
						$match: {
							$expr: {
								$or: [
									{ $in: ["$$bid", "$_bookIds"] },
									{ $in: [{ $toString: "$$bid" }, "$_bookIds"] },
								],
							},
						},
					},
					{
						$project: {
							_id: 0,
						},
					},
				],
			},
		},
		{
			$set: {
				purchaseCount: {
					$size: "$purchases",
				},
			},
		},
		{
			$unset: ["purchases"],
		},
	],
};

export { conditions as MongoBookConditions };
