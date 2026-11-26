<?xml version="1.0" encoding="UTF-8"?>
<!-- Browser view for /sitemap.xml. Crawlers ignore it. Colors match app/globals.css. -->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="s xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex"/>
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2"/>
        <title>XML Sitemap · IPTV Pro</title>
        <style>
          :root { --bg:#0d0810; --fg:#f0e8ea; --muted:#bfa5a4; --crimson:#dc143c; --teal:#0093d5; --teal-light:#5cb6d6; --violet:#5c4b8a; --line:rgb(0 147 213 / .2); }
          * { box-sizing:border-box; margin:0; }
          body { background:var(--bg); color:var(--fg); font:15px/1.6 Inter, system-ui, -apple-system, "Segoe UI", sans-serif; padding:0 16px 64px; }
          header { margin:0 -16px 40px; padding:56px 16px 44px; text-align:center; border-bottom:1px solid var(--line);
            background:radial-gradient(ellipse at 20% 0%, rgb(0 147 213 / .18) 0%, transparent 55%), linear-gradient(135deg, rgb(220 20 60 / .72) 0%, rgb(92 75 138 / .75) 50%, rgb(13 8 16 / .94) 100%); }
          .label { display:inline-block; margin-bottom:12px; font-size:12px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--teal-light); }
          h1 { font-size:clamp(28px, 4.5vw, 44px); font-weight:900; line-height:1.2; color:#fff; margin-bottom:12px; }
          header p { color:var(--fg); opacity:.85; max-width:620px; margin:0 auto; }
          header a { color:#fff; }
          .wrap { max-width:1200px; margin:0 auto; }
          .stats { display:flex; flex-wrap:wrap; gap:12px; margin-bottom:24px; }
          .stat { border:1px solid var(--line); background:rgb(220 20 60 / .06); border-radius:12px; padding:10px 18px; color:var(--muted); font-size:14px; }
          .stat b { color:#fff; font-size:18px; margin-right:6px; }
          .table { border:1px solid var(--line); border-radius:20px; overflow:hidden; background:rgb(220 20 60 / .04); }
          table { width:100%; border-collapse:collapse; }
          th { text-align:left; font-size:12px; letter-spacing:.06em; text-transform:uppercase; color:var(--muted); font-weight:700; padding:14px 18px; background:rgb(92 75 138 / .18); border-bottom:1px solid var(--line); }
          td { padding:12px 18px; border-bottom:1px solid rgb(255 255 255 / .05); vertical-align:top; font-size:14px; }
          tr:last-child td { border-bottom:0; }
          tbody tr:hover td { background:rgb(0 147 213 / .06); }
          td a { color:var(--fg); text-decoration:none; word-break:break-all; }
          td a:hover { color:var(--teal-light); }
          .alts { margin-top:4px; font-size:12px; color:var(--muted); }
          .alts a { color:var(--muted); margin-right:10px; }
          .lang { display:inline-block; min-width:34px; text-align:center; border-radius:999px; padding:2px 8px; font-size:11px; font-weight:800; text-transform:uppercase; border:1px solid currentColor; }
          .lang-en { color:var(--teal-light); }
          .lang-pl { color:#ff6f8a; }
          .num, .date { white-space:nowrap; color:var(--muted); }
          .bar { display:inline-block; vertical-align:middle; width:56px; height:6px; border-radius:6px; background:rgb(255 255 255 / .08); margin-right:8px; overflow:hidden; }
          .bar i { display:block; height:100%; background:linear-gradient(90deg, var(--teal), var(--crimson)); }
          @media (max-width:720px) {
            thead { display:none; }
            tr { display:block; padding:12px 16px; border-bottom:1px solid rgb(255 255 255 / .06); }
            td { display:inline-block; border:0; padding:2px 10px 2px 0; }
            td.url { display:block; padding-bottom:6px; }
          }
        </style>
      </head>
      <body>
        <header>
          <span class="label">XML Sitemap</span>
          <h1>IPTV Pro Sitemap</h1>
          <p>This file is for search engines. Looking for a page? Try the <a href="/en/sitemap">sitemap page</a> or <a href="/pl/sitemap">mapę strony</a>.</p>
        </header>
        <div class="wrap">
          <xsl:apply-templates select="s:urlset | s:sitemapindex"/>
        </div>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="s:urlset">
    <div class="stats">
      <span class="stat"><b><xsl:value-of select="count(s:url)"/></b>URLs</span>
      <span class="stat"><b><xsl:value-of select="count(s:url[xhtml:link[@hreflang='en'][@href = ../s:loc]])"/></b>English</span>
      <span class="stat"><b><xsl:value-of select="count(s:url[xhtml:link[@hreflang='pl'][@href = ../s:loc]])"/></b>Polish</span>
    </div>
    <div class="table">
      <table>
        <thead><tr><th>URL</th><th>Language</th><th>Last modified</th><th>Priority</th></tr></thead>
        <tbody>
          <xsl:for-each select="s:url">
            <xsl:sort select="s:priority" data-type="number" order="descending"/>
            <xsl:variable name="loc" select="s:loc"/>
            <xsl:variable name="lang" select="xhtml:link[@href = $loc][@hreflang != 'x-default']/@hreflang"/>
            <tr>
              <td class="url">
                <a href="{$loc}"><xsl:value-of select="$loc"/></a>
                <xsl:if test="xhtml:link[@href != $loc]">
                  <div class="alts">
                    <xsl:for-each select="xhtml:link[@href != $loc]">
                      <a href="{@href}">↳ <xsl:value-of select="@hreflang"/></a>
                    </xsl:for-each>
                  </div>
                </xsl:if>
              </td>
              <td><span class="lang lang-{$lang}"><xsl:value-of select="$lang"/></span></td>
              <td class="date"><xsl:value-of select="substring(s:lastmod, 1, 10)"/></td>
              <td class="num">
                <span class="bar"><i style="width:{s:priority * 100}%"/></span>
                <xsl:value-of select="s:priority"/>
              </td>
            </tr>
          </xsl:for-each>
        </tbody>
      </table>
    </div>
  </xsl:template>

  <xsl:template match="s:sitemapindex">
    <div class="stats">
      <span class="stat"><b><xsl:value-of select="count(s:sitemap)"/></b>sitemaps</span>
    </div>
    <div class="table">
      <table>
        <thead><tr><th>Sitemap</th><th>Last modified</th></tr></thead>
        <tbody>
          <xsl:for-each select="s:sitemap">
            <tr>
              <td class="url"><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
              <td class="date"><xsl:value-of select="substring(s:lastmod, 1, 10)"/></td>
            </tr>
          </xsl:for-each>
        </tbody>
      </table>
    </div>
  </xsl:template>
</xsl:stylesheet>
