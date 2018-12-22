// +build js,wasm
package main

import (
	"fmt"
	"math/big"
	"syscall/js"
	"time"

	"github.com/mjschust/cblocks/bundle"
	"github.com/mjschust/cblocks/lie"
)

func main() {
	goModules := js.Global().Get("goModules")
	testModule := js.ValueOf(map[string]interface{}{})
	testModule.Set("benchmarkRank", js.NewCallback(benchmarkSymmetricCBRank))
	testModule.Set("computeSymmetricRank", js.NewCallback(computeSymmetricRank))
	testModule.Set("computeRankData", js.NewCallback(computeRankData))
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
	// TODO: make these parameters
	rank := 3
	level := 4
	n := 10

	// Callback to store result
	callback := args[0]

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
			callback.Invoke(js.TypedArrayOf(wt32), js.ValueOf(rk.Int64()))
		}(wts[i])
	}
}

func benchmarkSymmetricCBRank(args []js.Value) {
	start := time.Now()
	rank := 5
	level := 4
	n := 10
	alg := lie.NewAlgebra(lie.NewTypeARootSystem(rank))
	wts := alg.Weights(level)
	for j := 0; j < len(wts); j++ {
		bun := bundle.NewSymmetricCBBundle(alg, wts[j], level, n)
		rk := bun.Rank()
		if rk.Cmp(big.NewInt(0)) == 0 {
			continue
		}
		fmt.Printf("%v: %v\n", wts[j], rk)
	}
	elasped := time.Since(start)

	fmt.Printf("Rank test took %s seconds\n", elasped)
}
