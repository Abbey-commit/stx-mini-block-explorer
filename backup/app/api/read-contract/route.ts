export async function POST(request: Request) {
  const body = await request.json();
  
  const response = await fetch(`https://api.testnet.hiro.so/v2/contracts/call-read/${body.contract}/${body.function}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: body.sender,
      arguments: body.arguments
    })
  });
  
  return Response.json(await response.json());
}