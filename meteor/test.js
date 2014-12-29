Tinytest.add('NoVnc object exists', function (test) {
  test.instanceOf(NoVnc, Object);
});

Tinytest.add('NoVnc object got ReactiveVar size and state', function (test) {
  test.instanceOf(NoVnc.size, Object);
  test.instanceOf(NoVnc.size.get, Object);

  test.instanceOf(NoVnc.state, Object);
  test.instanceOf(NoVnc.state.get, Object);
});
