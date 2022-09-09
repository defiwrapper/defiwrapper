case1: {
		$0: {
			data: {
				token: {
						address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
						name: "Wrapped Ether",
						symbol: "WETH",
						decimals: 18,
						totalSupply: =~ "^\\d+$",
					},
					balance: =~ "^\\d+\\.?\\d*$",
					values: [
						{
							currency: "usd",
							price: =~ "^\\d+\\.?\\d*$",
							value: =~ "^\\d+\\.?\\d*$",
						}
					]
				}
			error?: _|_,
		}
}

