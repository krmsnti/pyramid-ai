import { NextResponse } from "next/server";

function generateMockResponse(message: string) {
  const text = message.toLowerCase();

  if (text.includes("linked")) {
    return `Linked list üzerinde çalışıyorsun.

Döngü içinde current değişkeni güncelleniyor mu?

while koşulunun ne zaman false olacağını kontrol etmeyi dene.`;
  }

  if (text.includes("tree")) {
    return `Tree yapılarında base case eksikliği sık görülen bir problemdir.

Rekürsiyonun nerede sonlandığını inceleyebilir misin?`;
  }

  if (text.includes("react")) {
    return `React ile ilgili bir konu üzerinde çalışıyorsun.

Sorun state güncellenmesinde mi yoksa render sürecinde mi ortaya çıkıyor?`;
  }

  if (text.includes("python")) {
    return `Python kodunda bir problem olabilir.

Hata mesajının son satırını paylaşabilir misin?`;
  }

  return `Sorunu anlamaya çalışıyorum.

Ne yapmak istiyordun?

Beklediğin davranış ile gördüğün davranış arasındaki fark nedir?`;
}

export async function POST(req: Request) {
  const { message } = await req.json();

  return NextResponse.json({
    response: generateMockResponse(message),
  });
}