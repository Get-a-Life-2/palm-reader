// Hands a picked File from the landing page to the reading page across a
// client-side navigation. Module state persists for the SPA session, which is
// all we need — a hard refresh on /reading will find nothing here and bounce
// back to /.

let pending: File | null = null;

export function setPendingFile(file: File): void {
  pending = file;
}

export function consumePendingFile(): File | null {
  const f = pending;
  pending = null;
  return f;
}
