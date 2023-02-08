let n = 8;

for (let i = 0; i < n; i++) {
  if (i % 2 != 0) process.stdout.write(' ');
  for (let j = 0; j < n; j++) {
    process.stdout.write('# ');
  }
  console.log('\n');
}
