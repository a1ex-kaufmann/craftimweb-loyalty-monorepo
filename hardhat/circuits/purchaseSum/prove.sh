#!/bin/bash

snarkjs groth16 prove purchaseSum_0001.zkey witness.wtns proof.json public.json
snarkjs groth16 verify verification_key.json public.json proof.json