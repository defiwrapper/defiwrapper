sushibar: {
	$0: {
		data: {
			id: "sushibar_v1",
			organization: "Sushi",
			name: "Sushibar",
			version: "1",
			adapterUri: "ens/sushibar.asset.resolvers.defiwrapper.eth",
			forkedFrom: null
		}
		error?: _|_,
	}
}
sushiswap: {
	$0: {
		data: {
				id: "sushiswap_v1",
				organization: "Sushi",
				name: "Sushiswap",
				version: "1",
				adapterUri: null,
				forkedFrom: {
					id: "uniswap_v2",
					organization: "Uniswap",
					name: "Uniswap",
					adapterUri: "ens/uniswap.asset.resolvers.defiwrapper.eth",
					version: "2",
					forkedFrom: null,
				},
			}
		error?: _|_,
	}
}
curve: {
	$0: {
		data: {
				id: "curve_fi_pool_v2",
				organization: "Curve.fi",
				name: "Curve.fi pool",
				version: "2",
				adapterUri: "ens/curve.asset.resolvers.defiwrapper.eth",
				forkedFrom: null,
			}
		error?: _|_,
	}
}
supportedProtocols: {
	$0: {
		data: [...{}]
		error?: _|_,
	}
}