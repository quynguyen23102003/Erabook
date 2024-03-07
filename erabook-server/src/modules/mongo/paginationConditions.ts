const conditions = {
	pagination: (queryPage = 1, queryLimit = 50) => [
		{
			$facet: {
				hasNext: [
					{ $skip: queryPage * queryLimit },
					{
						$count: "count",
					},
					{
						$set: {
							state: {
								$cond: {
									if: { $gte: ["$count", 0] },
									then: true,
									else: false,
								},
							},
						},
					},
				],
				pagination: [
					{
						$count: "itemCount",
					},
					{
						$addFields: {
							pageCount: {
								$ceil: {
									$divide: ["$itemCount", queryLimit],
								},
							},
							currentPage: queryPage,
						},
					},
				],
				data: [{ $skip: (queryPage - 1) * queryLimit }, { $limit: queryLimit }],
			},
		},
		{
			$set: {
				pagination: {
					$arrayElemAt: ["$pagination", 0],
				},
			},
		},
		{
			$set: {
				pagination: {
					hasNext: {
						$cond: {
							if: { $gt: [{ $size: "$hasNext" }, 0] },
							then: true,
							else: false,
						},
					},
				},
			},
		},
		{
			$unset: "hasNext",
		},
	],
};

export { conditions as MongoPaginationConditions };
