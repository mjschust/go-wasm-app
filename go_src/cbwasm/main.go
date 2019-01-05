// +build js,wasm
package main

import (
	"math/big"
	"syscall/js"

	"github.com/mjschust/cblocks/bundle"
	"github.com/mjschust/cblocks/lie"
)

func main() {
	goModules := js.Global().Get("goModules")
	testModule := js.ValueOf(map[string]interface{}{})
	testModule.Set("computeSymmetricRank", js.NewCallback(computeSymmetricRank))
	testModule.Set("computeRankData", js.NewCallback(computeRankData))
	testModule.Set("computeDivisorData", js.NewCallback(computeDivisorData))
	goModules.Set("testModule", testModule)
	c := make(chan struct{})
	<-c
}

func computeSymmetricRank(args []js.Value) {
	// Extract args
	bundleArgs := args[0]
	rank := bundleArgs.Get("rank").Int()
	level := bundleArgs.Get("level").Int()
	n := bundleArgs.Get("numPoints").Int()
	wtValueArray := bundleArgs.Get("weight")
	wt := make([]int, rank)
	for i := 0; i < rank; i++ {
		wt[i] = wtValueArray.Index(i).Int()
	}

	alg := lie.NewAlgebra(lie.NewTypeARootSystem(rank))
	bun := bundle.NewSymmetricCBBundle(alg, wt, level, n)
	rk := bun.Rank()

	// Store return value
	callback := args[1]
	callback.Invoke(js.ValueOf(rk.Int64()))
}

func computeRankData(args []js.Value) {
	// Extract args
	bundleArgs := args[0]
	rank := bundleArgs.Get("rank").Int()
	level := bundleArgs.Get("level").Int()
	n := bundleArgs.Get("numPoints").Int()

	// Callback to store result
	callback := args[1]

	alg := lie.NewAlgebra(lie.NewTypeARootSystem(rank))
	wts := alg.Weights(level)
	wt32 := make([]int32, rank)
	for i := 0; i < len(wts); i++ {
		go func(wt lie.Weight) {
			bun := bundle.NewSymmetricCBBundle(alg, wt, level, n)
			rk := bun.Rank()
			if rk.Cmp(big.NewInt(0)) == 0 {
				return
			}
			for j, coord := range wt {
				wt32[j] = int32(coord)
			}
			callback.Invoke(js.TypedArrayOf(wt32), js.ValueOf(rk.Text(10)))
		}(wts[i])
	}
}

func computeDivisorData(args []js.Value) {
	// Extract args
	bundleArgs := args[0]
	rank := bundleArgs.Get("rank").Int()
	level := bundleArgs.Get("level").Int()
	n := bundleArgs.Get("numPoints").Int()

	// Callback to store result
	callback := args[1]

	alg := lie.NewAlgebra(lie.NewTypeARootSystem(rank))
	wts := alg.Weights(level)
	wt32 := make([]int32, rank)
	for i := 0; i < len(wts); i++ {
		go func(wt lie.Weight) {
			// Compute data
			bun := bundle.NewSymmetricCBBundle(alg, wt, level, n)
			rk := bun.Rank()
			if rk.Cmp(big.NewInt(0)) == 0 {
				return
			}
			divisor := bun.SymmetrizedDivisor()

			// Send data
			for j, coord := range wt {
				wt32[j] = int32(coord)
			}
			divArray := js.ValueOf([]interface{}{})
			for _, coord := range divisor {
				divArray.Call("push", coord.RatString())
			}
			callback.Invoke(js.TypedArrayOf(wt32), js.ValueOf(rk.Text(10)), divArray)
		}(wts[i])
	}
}

