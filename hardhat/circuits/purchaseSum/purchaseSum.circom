pragma circom 2.0.0;

template MultiplierGate(){
  signal input in[2];
  signal output out <== in[0] * in[1];
}

template SumGate() {
  signal input in[2];
  signal output out <== in[0] + in[1];
}

template PurchaseSum(N) {
  assert(N > 1);
  signal input in[N];
  signal input inMul[N];
  signal output out;
  component mulGate[N];
  component sumGate[N-1];
  signal d; 

  // instantiate gates
  for (var i = 0; i < N; i++) {
    mulGate[i] = MultiplierGate();
  }
  for (var i = 0; i < N-1; i++) {
    sumGate[i] = SumGate();
  }

  d <-- 1;

  // mul
  mulGate[0].in <== [in[0], inMul[0]];
  for (var i = 1; i < N; i++) {
    mulGate[i].in <== [in[i], inMul[i]];
  }

  // sum
  sumGate[0].in <== [mulGate[0].out, mulGate[1].out];
  for (var i = 0; i < N-2; i++) {
    sumGate[i+1].in <== [sumGate[i].out, mulGate[i+2].out];
  }

  
  out <== sumGate[N-2].out * d;
}

component main = PurchaseSum(100);