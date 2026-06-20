// Public Supabase credentials for the waitlist form.
//
// SAFE TO EXPOSE: this is the publishable (anon) key — the same one shipped in
// the mobile app. With the waitlist table's RLS it can ONLY insert a row into
// `waitlist`; it cannot read, update, or delete anyone's data. The secret
// service-role key is NEVER placed here.
window.WAITLIST_CONFIG = {
  url: 'https://cxxamybjplgntakbgxsn.supabase.co',
  anonKey: 'sb_publishable_E2dy2Eg_6BIl_GiCNgWo8w_nVk0sJWY',
  source: 'join.elunimy.com',
};
