import Link from 'next/link';

async function getProfile(handle: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/portfolio?handle=${encodeURIComponent(handle)}`, { cache: 'no-store' });
  const data = await res.json();
  return data.profile || null;
}

export default async function Portfolio({ params }: { params: { handle: string } }) {
  const profile = await getProfile(params.handle);
  return (
    <section className="section stack" style={{ maxWidth: 720 }}>
      <h2>Portfolio: {params.handle}</h2>
      {!profile && <div className="muted">No artifacts yet</div>}
      {profile && (
        <>
          <div className="list">
            {profile.artifacts.map((a: any, i: number) => (
              <div key={i} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div>{a.title}</div>
                    <div className="muted">{a.description}</div>
                  </div>
                  {a.repo && <Link className="btn" href={a.repo}>Repo</Link>}
                </div>
              </div>
            ))}
          </div>
          <div className="stack">
            <div>Badges</div>
            <div className="list">
              {profile.badges?.length ? profile.badges.map((b: string, i: number) => <span key={i} className="badge">{b}</span>) : <span className="muted">None</span>}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
