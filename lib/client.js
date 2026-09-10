// dsh-memorix-panel — browser half.
//
// Loaded by the DSH shell as `dsh-memorix-panel/client.js` (see the
// `dsh.client` declaration in package.json). Mounts the Memorix panel twice
// safe:
//
//   1. with dsh-better-sidebar present  → a native right-workbench tab
//      (`ctx.betterSidebar.registerTab`), so the entry lives in the right
//      workspace next to Files / Terminal / …;
//   2. otherwise (or alongside a foreign shell) → a native session-header
//      utility entry whose panel renders in the browser top layer, so no
//      other panel can ever cover it.
//
// All data crosses to the host half through POST /memorix-panel/api.
window.__ModuleLoader__.load({
  id: 'dsh-memorix-panel',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })

    const React = require('react')
    const h = React.createElement

    const STYLE_ID = 'dsh-memorix-panel/panel.css'
    const CSS = `
.mxov-entry{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 8px;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:12px;font-family:var(--dsw-font-family);}
.mxov-entry:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary);}
#dsh-memorix-panel-root[data-placement=edge] .mxov-entry{position:fixed;right:0;top:50%;transform:translateY(-50%);z-index:2147482000;height:auto;padding:7px 10px;border-top:.5px solid var(--dsw-alias-border-l2);border-bottom:.5px solid var(--dsw-alias-border-l2);border-left:.5px solid var(--dsw-alias-border-l3);border-radius:8px 0 0 8px;background:var(--dsw-alias-bg-layer-1);box-shadow:var(--dsw-shadow-lv3);}
.mxov-dot{width:7px;height:7px;border-radius:50%;background:var(--dsw-alias-state-success-primary);flex:0 0 auto;}
.mxov-dot[data-state=loading]{background:var(--dsw-alias-state-warn-primary);}
.mxov-dot[data-state=error]{background:var(--dsw-alias-state-error-primary);}
.mxov-panel{position:fixed;top:0;right:0;bottom:0;left:auto;margin:0;padding:0;width:clamp(320px,26vw,520px);max-width:95vw;height:auto;max-height:none;border:0;border-left:.5px solid var(--dsw-alias-border-l3);border-radius:0;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);box-shadow:var(--dsw-elevation-prominent,var(--dsw-shadow-lv3));display:flex;flex-direction:column;overflow:hidden;z-index:2147483000;font-family:var(--dsw-font-family);font-size:13px;line-height:20px;}
.mxov-panel[data-variant=tab]{position:relative;inset:auto;width:100%;height:100%;max-width:none;max-height:none;border-left:0;box-shadow:none;z-index:auto;}
.mxov-panel *{box-sizing:border-box;}
.mxov-head{display:flex;align-items:center;gap:8px;min-height:46px;padding:0 10px 0 14px;border-bottom:.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);flex:0 0 auto;}
.mxov-title{font-weight:600;font-size:13px;white-space:nowrap;}
.mxov-sub{color:var(--dsw-alias-label-tertiary);font-size:11px;margin-left:auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px;}
.mxov-btn{height:26px;padding:0 10px;border-radius:8px;border:.5px solid var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:12px;flex:0 0 auto;font-family:var(--dsw-font-family);}
.mxov-btn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary);}
.mxov-btn[disabled]{opacity:.5;cursor:default;}
.mxov-btn[data-primary=true]{background:var(--dsw-alias-button-primary-fill);border-color:transparent;color:var(--dsw-alias-label-primary-inverted);}
.mxov-btn[data-primary=true]:hover{background:var(--dsw-alias-button-primary-hover);}
.mxov-body{flex:1 1 auto;overflow-y:auto;padding:12px;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-scrollbar-bg-l2) transparent;}
.mxov-body::-webkit-scrollbar{width:8px;height:8px;}
.mxov-body::-webkit-scrollbar-track{background:transparent;}
.mxov-body::-webkit-scrollbar-thumb{background:var(--dsw-alias-scrollbar-bg-l2);border-radius:4px;}
.mxov-body::-webkit-scrollbar-thumb:hover{background:var(--dsw-alias-scrollbar-hover-l2);}
.mxov-card{border:.5px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1);padding:10px 12px;margin-bottom:10px;}
.mxov-kv{display:flex;gap:10px;justify-content:space-between;font-size:12px;padding:3px 0;}
.mxov-k{color:var(--dsw-alias-label-tertiary);white-space:nowrap;}
.mxov-v{color:var(--dsw-alias-label-secondary);text-align:right;word-break:break-all;}
.mxov-chips{display:flex;flex-wrap:wrap;gap:6px;}
.mxov-chip{font-size:11px;padding:2px 8px;border-radius:999px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);}
.mxov-fchip{font-size:11px;padding:3px 9px;border-radius:999px;border:.5px solid var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font-family:var(--dsw-font-family);}
.mxov-fchip:hover{border-color:var(--dsw-alias-border-l3);color:var(--dsw-alias-label-primary);}
.mxov-fchip[data-on=true]{background:var(--dsw-alias-brand-primary);border-color:transparent;color:var(--dsw-alias-label-primary-inverted);}
.mxov-frow{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:6px;}
.mxov-flabel{font-size:11px;color:var(--dsw-alias-label-tertiary);margin-right:2px;}
.mxov-sec{font-size:11px;color:var(--dsw-alias-label-tertiary);margin:12px 2px 6px;letter-spacing:.04em;}
.mxov-proj{border:.5px solid var(--dsw-alias-border-l1);border-radius:10px;margin-bottom:8px;overflow:hidden;background:var(--dsw-alias-bg-layer-1);}
.mxov-projhead{display:flex;align-items:center;gap:8px;padding:9px 12px;cursor:pointer;}
.mxov-projhead:hover{background:var(--dsw-alias-interactive-bg-hover);}
.mxov-caret{color:var(--dsw-alias-label-tertiary);font-size:10px;width:10px;flex:0 0 auto;}
.mxov-pname{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.mxov-pmeta{margin-left:auto;color:var(--dsw-alias-label-tertiary);font-size:11px;white-space:nowrap;flex:0 0 auto;}
.mxov-mem{padding:7px 12px;border-top:.5px solid var(--dsw-alias-border-l1);display:flex;gap:8px;align-items:flex-start;cursor:pointer;}
.mxov-mem:hover{background:var(--dsw-alias-interactive-bg-hover);}
.mxov-mem[data-archived=true] .mxov-memname,.mxov-mem[data-archived=true] .mxov-memmeta{opacity:.55;}
.mxov-memtitle{flex:1 1 auto;min-width:0;}
.mxov-memname{overflow:hidden;text-overflow:ellipsis;}
.mxov-memmeta{color:var(--dsw-alias-label-tertiary);font-size:11px;margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.mxov-tdot{display:inline-block;width:6px;height:6px;border-radius:50%;margin-right:5px;vertical-align:middle;background:var(--dsw-alias-label-tertiary);}
.mxov-id{color:var(--dsw-alias-label-dimmed);font-size:10px;flex:0 0 auto;padding-top:2px;}
.mxov-search,.mxov-input,.mxov-textarea{width:100%;padding:6px 10px;border-radius:8px;border:.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font-size:12px;font-family:var(--dsw-font-family);}
.mxov-search{height:30px;margin-bottom:8px;}
.mxov-textarea{min-height:72px;resize:vertical;line-height:19px;}
.mxov-search:focus,.mxov-input:focus,.mxov-textarea:focus{outline:none;border-color:var(--dsw-alias-brand-primary);}
.mxov-field{display:block;margin-bottom:9px;}
.mxov-flabel2{display:block;font-size:11px;color:var(--dsw-alias-label-tertiary);margin-bottom:3px;}
.mxov-hint{font-size:11px;color:var(--dsw-alias-label-dimmed);margin-top:3px;line-height:16px;}
.mxov-empty{padding:22px 12px;text-align:center;color:var(--dsw-alias-label-tertiary);font-size:12px;}
.mxov-err{padding:8px 10px;border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-state-error-primary);font-size:12px;margin-bottom:10px;word-break:break-word;white-space:pre-wrap;}
.mxov-ok{padding:8px 10px;border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-state-success-primary);font-size:12px;margin-bottom:10px;}
.mxov-pre{white-space:pre-wrap;word-break:break-word;font-size:12px;line-height:19px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border:.5px solid var(--dsw-alias-border-l1);border-radius:8px;padding:8px 10px;margin:6px 0;}
.mxov-dtitle{font-weight:600;font-size:14px;line-height:20px;margin:2px 0 8px;}
.mxov-list{margin:4px 0 0;padding-left:18px;}
.mxov-list li{font-size:12px;line-height:19px;color:var(--dsw-alias-label-secondary);word-break:break-word;margin-bottom:3px;}
.mxov-mono{font-family:var(--dsw-font-markdown-code,monospace);font-size:11px;word-break:break-all;}
.mxov-back{display:flex;align-items:center;gap:6px;margin-bottom:8px;}
`

    const TYPE_LABEL = {
      'how-it-works': '说明', decision: '决策', gotcha: '坑', discovery: '发现',
      'problem-solution': '修复', 'what-changed': '变更', 'why-it-exists': '缘由',
      'trade-off': '权衡', reasoning: '推理', probe: '探针', 'session-request': '请求',
    }
    const TYPE_ORDER = ['decision', 'discovery', 'how-it-works', 'gotcha', 'problem-solution', 'what-changed', 'why-it-exists', 'trade-off', 'reasoning', 'probe', 'session-request']
    const STATUS_LABEL = { active: '活跃', resolved: '已解决', archived: '已归档' }
    const STATUS_ORDER = ['active', 'resolved', 'archived']
    const TYPE_COLOR = {
      decision: 'var(--dsw-alias-state-business-primary)',
      gotcha: 'var(--dsw-alias-state-warn-primary)',
      discovery: 'var(--dsw-alias-state-success-primary)',
      'problem-solution': 'var(--dsw-alias-state-success-primary)',
      'what-changed': 'var(--dsw-alias-brand-primary)',
      'why-it-exists': 'var(--dsw-alias-brand-primary)',
      'trade-off': 'var(--dsw-alias-state-warn-primary)',
      reasoning: 'var(--dsw-alias-label-secondary)',
      probe: 'var(--dsw-alias-label-dimmed)',
    }
    const STATUS_COLOR = {
      active: 'var(--dsw-alias-state-success-primary)',
      archived: 'var(--dsw-alias-label-dimmed)',
      resolved: 'var(--dsw-alias-state-business-primary)',
    }

    // Durable (long-term) memory vocabulary.
    const LT_STATE_LABEL = { approved: '已批准', qualified: '已确认', candidate: '候选', archived: '已归档', superseded: '已被取代' }
    const LT_STATE_ORDER = ['approved', 'qualified', 'candidate', 'archived', 'superseded']
    const LT_STATE_COLOR = {
      approved: 'var(--dsw-alias-state-success-primary)',
      qualified: 'var(--dsw-alias-state-business-primary)',
      candidate: 'var(--dsw-alias-state-warn-primary)',
      archived: 'var(--dsw-alias-label-dimmed)',
      superseded: 'var(--dsw-alias-label-dimmed)',
    }
    const LT_SCOPE_LABEL = { user: '用户级', project: '项目级', team: '团队级' }
    const LT_SCOPE_ORDER = ['user', 'project', 'team']
    const LT_KIND_LABEL = { semantic: '事实', procedural: '流程', episodic: '事件' }

    const typeLabel = (t) => TYPE_LABEL[t] || t || '未知'
    const statusLabel = (s) => STATUS_LABEL[s] || s || ''
    const ltStateLabel = (s) => LT_STATE_LABEL[s] || s || ''
    const ltStateColor = (s) => LT_STATE_COLOR[s] || 'var(--dsw-alias-label-tertiary)'
    const ltScopeLabel = (s) => LT_SCOPE_LABEL[s] || s || ''
    const ltKindLabel = (k) => LT_KIND_LABEL[k] || k || ''
    const typeColor = (t) => TYPE_COLOR[t] || 'var(--dsw-alias-label-tertiary)'
    const statusColor = (s) => STATUS_COLOR[s] || 'var(--dsw-alias-label-tertiary)'
    const ts = (v) => String(v || '').replace('T', ' ').replace('Z', '')
    const lines = (v) => String(v || '').split('\n').map((x) => x.trim()).filter((x) => x !== '')

    function fmtBytes(n) {
      if (typeof n !== 'number' || !isFinite(n)) return ''
      if (n < 1024) return n + ' B'
      if (n < 1048576) return (n / 1024).toFixed(1) + ' KB'
      if (n < 1073741824) return (n / 1048576).toFixed(1) + ' MB'
      return (n / 1073741824).toFixed(2) + ' GB'
    }

    /** One panel API call against the host half. */
    function api(action, payload) {
      const body = Object.assign({ action }, payload || {})
      return fetch('/memorix-panel/api', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(body),
      }).then(async (res) => {
        let parsed
        try {
          parsed = await res.json()
        } catch (e) {
          return { ok: false, error: '接口返回无法解析(HTTP ' + res.status + ')' }
        }
        return parsed
      })
    }

    /** Insert this package's stylesheet once. */
    function injectStyle() {
      if (document.querySelector('style[data-plugin-css="' + STYLE_ID + '"]')) return null
      const tag = document.createElement('style')
      tag.dataset.plugin = 'dsh-memorix-panel'
      tag.dataset.pluginCss = STYLE_ID
      tag.textContent = CSS
      document.head.appendChild(tag)
      return () => {
        if (tag.parentNode) tag.parentNode.removeChild(tag)
      }
    }

    /** The panel body: list view, detail view and the new-memory form. */
    function MemorixPanel(props) {
      const variant = props.variant
      const [open, setOpen] = React.useState(variant === 'tab')
      const [phase, setPhase] = React.useState('idle')
      const [data, setData] = React.useState(null)
      const [error, setError] = React.useState('')
      const [detailErr, setDetailErr] = React.useState('')
      const [query, setQuery] = React.useState('')
      const [expanded, setExpanded] = React.useState(null)
      const [typeFilter, setTypeFilter] = React.useState([])
      const [statusFilter, setStatusFilter] = React.useState([])
      const [openId, setOpenId] = React.useState(null)
      const [mem, setMem] = React.useState(null)
      const [memPhase, setMemPhase] = React.useState('idle')
      const [writePhase, setWritePhase] = React.useState('idle')
      const [writeTarget, setWriteTarget] = React.useState(null)
      const [writeErr, setWriteErr] = React.useState('')
      const [writeNote, setWriteNote] = React.useState('')
      const [composing, setComposing] = React.useState(false)
      const [stage, setStage] = React.useState('edit')
      const [lt, setLt] = React.useState(null)
      const [ltPhase, setLtPhase] = React.useState('idle')
      const [ltStateFilter, setLtStateFilter] = React.useState([])
      const [ltScopeFilter, setLtScopeFilter] = React.useState([])
      const [ltOpenId, setLtOpenId] = React.useState(null)
      const [ltWritePhase, setLtWritePhase] = React.useState('idle')
      const [ltWriteAction, setLtWriteAction] = React.useState(null)
      const [ltWriteReason, setLtWriteReason] = React.useState('面板操作')
      const [ltWriteErr, setLtWriteErr] = React.useState('')
      const [ltWriteNote, setLtWriteNote] = React.useState('')
      const [form, setForm] = React.useState({ title: '', text: '', type: 'discovery', entity: '', facts: '', concepts: '', files: '', topicKey: '', projectId: '' })

      /** Durable-memory fetch: same lifecycle as the overview refresh. */
      const loadLongTerm = React.useCallback(() => {
        setLtPhase('loading')
        return api('long-term').then((res) => {
          if (!res || res.ok === false) {
            setLt(null)
            setLtPhase('error')
            return
          }
          setLt(res)
          setLtPhase('ready')
        }).catch(() => setLtPhase('error'))
      }, [])

      const load = React.useCallback(() => {
        setPhase('loading')
        setError('')
        return api('overview').then((res) => {
          if (!res || res.ok === false) {
            setData(null); setPhase('error'); setError((res && res.error) || '读取 Memorix 失败')
            return
          }
          setData(res)
          setPhase('ready')
          setExpanded((cur) => cur || (res.projects && res.projects.length ? res.projects[0].id : null))
          setForm((cur) => {
            if (cur.projectId) return cur
            const next = Object.assign({}, cur)
            next.projectId = res.projects && res.projects.length ? res.projects[0].id : ''
            return next
          })
        }).catch((e) => {
          setData(null); setPhase('error'); setError(String((e && e.message) || e))
        })
      }, [])

      /** Refresh both layers (observation list + durable memories). */
      const refreshAll = React.useCallback(() => {
        loadLongTerm()
        return load()
      }, [load, loadLongTerm])

      /** Run one durable-memory transition, then re-read the durable layer. */
      const applyLtAction = React.useCallback((id, action, projectId) => {
        setLtWritePhase('writing')
        setLtWriteErr('')
        setLtWriteNote('')
        const reason = ltWriteReason.trim() || '面板操作'
        return api('lt-transition', { id: id, verb: action, reason: reason, projectId: projectId || '' }).then((res) => {
          if (!res || res.ok === false) {
            setLtWritePhase('idle')
            setLtWriteErr(((res && res.error) || '操作失败') + (res && res.detail ? String.fromCharCode(10) + res.detail : ''))
            return
          }
          setLtWritePhase('idle')
          setLtWriteAction(null)
          setLtWriteNote(action + ' 成功 → 状态:' + ltStateLabel(res.state))
          loadLongTerm()
        }).catch((e) => { setLtWritePhase('idle'); setLtWriteErr(String((e && e.message) || e)) })
      }, [ltWriteReason, loadLongTerm])

      const openMemory = React.useCallback((id) => {
        setComposing(false); setStage('edit')
        setOpenId(id); setMem(null); setMemPhase('loading'); setDetailErr('')
        setWritePhase('idle'); setWriteTarget(null); setWriteErr(''); setWriteNote('')
        return api('memory', { id }).then((res) => {
          if (!res || res.ok === false) { setMemPhase('error'); setDetailErr((res && res.error) || '读取记忆详情失败'); return }
          setMem(res.memory); setMemPhase('ready')
        }).catch((e) => { setMemPhase('error'); setDetailErr(String((e && e.message) || e)) })
      }, [])

      const applyStatus = React.useCallback((id, status) => {
        setWritePhase('writing'); setWriteErr(''); setWriteNote('')
        return api('set-status', { id, status }).then((res) => {
          if (!res || res.ok === false) {
            setWritePhase('idle')
            setWriteErr(((res && res.error) || '写入失败') + (res && res.detail ? '\n' + res.detail : ''))
            return
          }
          setWritePhase('idle'); setWriteTarget(null)
          setWriteNote('已更新为「' + statusLabel(status) + '」 (#' + String(id) + ')')
          openMemory(id)
          load()
        }).catch((e) => { setWritePhase('idle'); setWriteErr(String((e && e.message) || e)) })
      }, [openMemory, load])

      const submitNew = React.useCallback(() => {
        setStage('writing'); setWriteErr(''); setWriteNote('')
        return api('store', {
          title: form.title.trim(),
          text: form.text,
          type: form.type,
          entity: form.entity.trim(),
          facts: lines(form.facts),
          concepts: lines(form.concepts),
          files: lines(form.files),
          topicKey: form.topicKey.trim(),
          projectId: form.projectId,
        }).then((res) => {
          if (!res || res.ok === false) {
            setStage('edit')
            setWriteErr(((res && res.error) || '写入失败') + (res && res.detail ? '\n' + res.detail : ''))
            return
          }
          setStage('edit'); setComposing(false)
          setForm({ title: '', text: '', type: 'discovery', entity: '', facts: '', concepts: '', files: '', topicKey: '', projectId: form.projectId })
          setWriteNote((res.upserted ? '已更新 ' : '已新建 ') + '#' + String(res.id) + ' 「' + String(res.title || '') + '」')
          openMemory(res.id)
          load()
        }).catch((e) => { setStage('edit'); setWriteErr(String((e && e.message) || e)) })
      }, [form, openMemory, load])

      React.useEffect(() => {
        if (!open) return
        if (phase === 'idle') load()
        if (ltPhase === 'idle') loadLongTerm()
      }, [open, phase, ltPhase, load, loadLongTerm])

      const totals = data && data.totals ? data.totals : null
      const projects = data && data.projects ? data.projects : []
      const q = query.trim().toLowerCase()

      const allTypes = []
      projects.forEach((p) => {
        (p.types || []).forEach((t) => {
          const hit = allTypes.filter((x) => x.type === t.type)[0]
          if (hit) hit.count += t.count
          else allTypes.push({ type: t.type, count: t.count })
        })
      })
      allTypes.sort((a, b) => b.count - a.count)

      const passesFilter = (m) => {
        if (typeFilter.length && typeFilter.indexOf(m.type) < 0) return false
        if (statusFilter.length && statusFilter.indexOf(m.status) < 0) return false
        if (q) {
          const hay = (String(m.title || '') + ' ' + String(m.entity || '') + ' ' + String(m.type || '')).toLowerCase()
          if (hay.indexOf(q) < 0) return false
        }
        return true
      }
      const filteredOf = (p) => (p.memories || []).filter(passesFilter)
      const toggle = (arr, setArr, value) => {
        setArr(arr.indexOf(value) >= 0 ? arr.filter((x) => x !== value) : arr.concat([value]))
      }
      const setField = (key, value) => {
        setForm((cur) => { const next = Object.assign({}, cur); next[key] = value; return next })
      }

      const filtersActive = typeFilter.length > 0 || statusFilter.length > 0 || q.length > 0
      const matchCount = projects.reduce((sum, p) => sum + filteredOf(p).length, 0)
      const dotState = phase === 'error' ? 'error' : phase === 'loading' ? 'loading' : 'ok'
      const canSubmit = form.title.trim().length > 0 && form.text.trim().length > 0 && stage !== 'writing'
      const readOnly = data && data.readOnly === true
      const storeAllowed = !data || data.storeAllowed !== false

      function renderRows(rows) {
        return h('div', { className: 'mxov-card' }, rows.filter((r) => r && r.v).map((r, i) => h('div', { className: 'mxov-kv', key: i }, [
          h('span', { className: 'mxov-k', key: 'k' }, r.k),
          h('span', { className: 'mxov-v' + (r.mono ? ' mxov-mono' : ''), key: 'v', title: String(r.v) }, r.v),
        ])))
      }

      function renderMemory(m, key) {
        return h('div', {
          className: 'mxov-mem',
          key: key,
          'data-archived': m.status === 'archived' ? 'true' : 'false',
          title: '点击查看正文',
          onClick: () => openMemory(m.id),
        }, [
          h('div', { className: 'mxov-memtitle', key: 't' }, [
            h('div', { className: 'mxov-memname', key: 'n' }, [
              h('span', { className: 'mxov-tdot', key: 'd', style: { background: typeColor(m.type) } }),
              String(m.title || '(无标题)'),
            ]),
            h('div', { className: 'mxov-memmeta', key: 'm' }, [
              h('span', { key: 'ty' }, typeLabel(m.type)),
              ' · ',
              h('span', { key: 'st', style: { color: statusColor(m.status) } }, statusLabel(m.status)),
              ' · ' + String(m.age || ''),
              m.entity ? '  ·  ' + m.entity : '',
            ]),
          ]),
          h('span', { className: 'mxov-id', key: 'i' }, '#' + String(m.id)),
        ])
      }

      function renderProject(p) {
        const isOpen = expanded === p.id
        const items = filteredOf(p)
        const children = [h('div', { className: 'mxov-projhead', key: 'h', onClick: () => setExpanded(isOpen ? null : p.id) }, [
          h('span', { className: 'mxov-caret', key: 'c' }, isOpen ? '▾' : '▸'),
          h('span', { className: 'mxov-pname', key: 'n', title: p.id }, p.id),
          h('span', { className: 'mxov-pmeta', key: 'm' }, (filtersActive ? items.length + '/' + p.total : String(p.total)) + ' 条 · ' + p.active + ' 活跃' + (p.lastAge ? ' · ' + p.lastAge : '')),
        ])]
        if (isOpen) {
          children.push(h('div', { className: 'mxov-mem', key: 'types', style: { display: 'block', cursor: 'default' } },
            h('div', { className: 'mxov-chips' }, (p.types || []).map((t, i) => h('span', { className: 'mxov-chip', key: i }, typeLabel(t.type) + ' ' + String(t.count))))))
          if (!items.length) children.push(h('div', { className: 'mxov-empty', key: 'e' }, '没有匹配的记忆'))
          else items.forEach((m, i) => children.push(renderMemory(m, 'm' + String(m.id) + '-' + String(i))))
        }
        return h('div', { className: 'mxov-proj', key: p.id }, children)
      }

      function renderCompose() {
        const back = h('div', { className: 'mxov-back', key: 'back' },
          h('button', { className: 'mxov-btn', onClick: () => { setComposing(false); setStage('edit'); setWriteErr('') } }, '← 返回列表'))
        if (stage === 'confirm') {
          const summary = [
            { k: '标题', v: form.title.trim() },
            { k: '类型', v: typeLabel(form.type) + ' (' + form.type + ')' },
            { k: '实体', v: form.entity.trim() || 'general' },
            { k: '项目', v: form.projectId || '(默认项目)' },
            { k: '正文长度', v: String(form.text.length) + ' 字' },
            { k: '要点', v: lines(form.facts).length + ' 条' },
            { k: '概念', v: lines(form.concepts).length + ' 个' },
            { k: '涉及文件', v: lines(form.files).length + ' 个' },
            { k: 'topicKey', v: form.topicKey.trim() || '(自动生成)' },
          ]
          return h('div', { key: 'c' }, [
            back,
            h('div', { className: 'mxov-dtitle', key: 't' }, '确认新建记忆'),
            renderRows(summary),
            h('div', { className: 'mxov-card', key: 'warn' }, '写入会调用官方 CLI(`memorix memory store`):新建一条 active 记忆、source=manual。若 topicKey 与已有记忆重复,则会更新那一条而不是新建。'),
            h('div', { className: 'mxov-frow', key: 'a' }, [
              h('button', { className: 'mxov-btn', key: 'ok', 'data-primary': 'true', disabled: stage === 'writing', onClick: submitNew }, '确认写入'),
              h('button', { className: 'mxov-btn', key: 'no', onClick: () => setStage('edit') }, '取消'),
            ]),
            writeErr ? h('div', { className: 'mxov-err', key: 'e' }, writeErr) : null,
          ])
        }
        const writing = stage === 'writing'
        return h('div', { key: 'c' }, [
          back,
          h('div', { className: 'mxov-dtitle', key: 't' }, writing ? '正在写入 Memorix…' : '新建记忆'),
          h('label', { className: 'mxov-field', key: 'f1' }, [
            h('span', { className: 'mxov-flabel2', key: 'l' }, '标题 (必填)'),
            h('input', { key: 'i', className: 'mxov-input', value: form.title, disabled: writing, placeholder: '简短描述这条记忆', onChange: (e) => setField('title', e.target.value) }),
          ]),
          h('label', { className: 'mxov-field', key: 'f2' }, [
            h('span', { className: 'mxov-flabel2', key: 'l' }, '正文 (必填)'),
            h('textarea', { key: 'i', className: 'mxov-textarea', value: form.text, disabled: writing, placeholder: '完整描述:背景、结论、为什么', onChange: (e) => setField('text', e.target.value) }),
          ]),
          h('div', { className: 'mxov-frow', key: 'f3' }, [h('span', { className: 'mxov-flabel', key: 'l' }, '类型')].concat(
            TYPE_ORDER.map((t, i) => h('button', { key: 't' + i, className: 'mxov-fchip', 'data-on': form.type === t ? 'true' : 'false', disabled: writing, onClick: () => setField('type', t) }, typeLabel(t))))),
          h('label', { className: 'mxov-field', key: 'f4' }, [
            h('span', { className: 'mxov-flabel2', key: 'l' }, '实体 entity (可选,默认 general)'),
            h('input', { key: 'i', className: 'mxov-input', value: form.entity, disabled: writing, onChange: (e) => setField('entity', e.target.value) }),
          ]),
          h('label', { className: 'mxov-field', key: 'f5' }, [
            h('span', { className: 'mxov-flabel2', key: 'l' }, '要点 facts (每行一条)'),
            h('textarea', { key: 'i', className: 'mxov-textarea', value: form.facts, disabled: writing, onChange: (e) => setField('facts', e.target.value) }),
          ]),
          h('label', { className: 'mxov-field', key: 'f6' }, [
            h('span', { className: 'mxov-flabel2', key: 'l' }, '概念 concepts (每行一个)'),
            h('textarea', { key: 'i', className: 'mxov-textarea', value: form.concepts, disabled: writing, onChange: (e) => setField('concepts', e.target.value) }),
          ]),
          h('label', { className: 'mxov-field', key: 'f7' }, [
            h('span', { className: 'mxov-flabel2', key: 'l' }, '涉及文件 (每行一个路径,可选)'),
            h('textarea', { key: 'i', className: 'mxov-textarea', value: form.files, disabled: writing, onChange: (e) => setField('files', e.target.value) }),
          ]),
          h('label', { className: 'mxov-field', key: 'f8' }, [
            h('span', { className: 'mxov-flabel2', key: 'l' }, 'topicKey (可选;填写且已存在同键时会更新那条)'),
            h('input', { key: 'i', className: 'mxov-input', value: form.topicKey, disabled: writing, placeholder: '如 architecture/auth-model', onChange: (e) => setField('topicKey', e.target.value) }),
          ]),
          projects.length > 1 ? h('div', { className: 'mxov-frow', key: 'f9' }, [h('span', { className: 'mxov-flabel', key: 'l' }, '写入项目')].concat(
            projects.map((p, i) => h('button', { key: 'p' + i, className: 'mxov-fchip', 'data-on': form.projectId === p.id ? 'true' : 'false', disabled: writing, onClick: () => setField('projectId', p.id) }, p.id)))) : null,
          h('div', { className: 'mxov-frow', key: 'act' }, [
            h('button', { className: 'mxov-btn', key: 'go', 'data-primary': 'true', disabled: !canSubmit, onClick: () => { setStage('confirm'); setWriteErr('') } }, '下一步:确认'),
          ]),
          h('div', { className: 'mxov-hint', key: 'hint' }, '要点/概念/文件按"每行一条"提交;条目内的英文逗号会被去掉(CLI 以逗号分隔)。写入后自动跳进新记忆的详情页。'),
          writeErr ? h('div', { className: 'mxov-err', key: 'e' }, writeErr) : null,
        ])
      }

      function renderDetail() {
        const back = h('div', { className: 'mxov-back', key: 'back' },
          h('button', { className: 'mxov-btn', onClick: () => { setOpenId(null); setMem(null); setMemPhase('idle'); setWritePhase('idle'); setWriteTarget(null); setWriteErr(''); setWriteNote('') } }, '← 返回列表'))
        if (memPhase === 'loading') return h('div', { key: 'd' }, [back, h('div', { className: 'mxov-empty', key: 'l' }, '正在读取记忆正文…')])
        if (memPhase === 'error') return h('div', { key: 'd' }, [back, h('div', { className: 'mxov-err', key: 'e' }, detailErr)])
        if (!mem) return h('div', { key: 'd' }, [back])

        const rows = [
          { k: '编号', v: '#' + String(mem.id) },
          { k: '类型', v: typeLabel(mem.type) + ' (' + String(mem.type || '') + ')' },
          { k: '状态', v: statusLabel(mem.status) + ' (' + String(mem.status || '') + ')' },
          { k: '项目', v: mem.projectId || '-', mono: true },
          { k: '实体', v: mem.entityName || '-' },
          { k: '价值类别', v: mem.valueCategory || '-' },
          { k: '可见性', v: mem.visibility || '-' },
          { k: '来源', v: mem.source || '-' },
          { k: '令牌', v: mem.tokens === null || mem.tokens === undefined ? '-' : String(mem.tokens) },
          { k: '创建', v: ts(mem.createdAt) },
          { k: '更新', v: ts(mem.updatedAt) },
          { k: '修订次数', v: mem.revisionCount === null || mem.revisionCount === undefined ? '-' : String(mem.revisionCount) },
          { k: 'topicKey', v: mem.topicKey || '-', mono: true },
          { k: '会话', v: mem.sessionId || '-', mono: true },
          { k: '准入状态', v: mem.admissionState || '-' },
        ]

        const statusRow = h('div', { className: 'mxov-frow', key: 'strow' }, [h('span', { className: 'mxov-flabel', key: 'l' }, '状态')].concat(
          STATUS_ORDER.map((s, i) => {
            const cur = mem.status === s
            return h('button', {
              key: 's' + i,
              className: 'mxov-fchip',
              'data-on': cur ? 'true' : 'false',
              disabled: cur || readOnly || writePhase === 'writing',
              title: readOnly ? '该部署已禁用状态写入' : '',
              onClick: () => {
                if (cur || readOnly || writePhase === 'writing') return
                setWriteTarget(s); setWriteErr(''); setWriteNote(''); setWritePhase('confirm')
              },
            }, statusLabel(s) + (cur ? ' · 当前' : ''))
          })))

        const confirmBlock = (writePhase === 'confirm' && writeTarget) ? h('div', { className: 'mxov-card', key: 'confirm' }, [
          h('div', { key: 't', style: { marginBottom: '8px' } }, '确认把 #' + String(mem.id) + ' 从「' + statusLabel(mem.status) + '」改为「' + statusLabel(writeTarget) + '」?经官方 CLI 写入(同步检索索引),可随时改回。'),
          h('div', { className: 'mxov-frow', key: 'a', style: { marginBottom: '0' } }, [
            h('button', { key: 'ok', className: 'mxov-btn', 'data-primary': 'true', onClick: () => applyStatus(mem.id, writeTarget) }, '确认修改'),
            h('button', { key: 'no', className: 'mxov-btn', onClick: () => { setWritePhase('idle'); setWriteTarget(null) } }, '取消'),
          ]),
        ]) : null

        const writeBlock = []
        if (writePhase === 'writing') writeBlock.push(h('div', { className: 'mxov-empty', key: 'w' }, '正在写入 Memorix…'))
        if (writeNote) writeBlock.push(h('div', { className: 'mxov-ok', key: 'note' }, writeNote))
        if (writeErr) writeBlock.push(h('div', { className: 'mxov-err', key: 'werr' }, writeErr))

        const body = [back, h('div', { className: 'mxov-dtitle', key: 't' }, [
          h('span', { className: 'mxov-tdot', key: 'd', style: { background: typeColor(mem.type) } }),
          String(mem.title || '(无标题)'),
        ]), statusRow, confirmBlock].concat(writeBlock)
        body.push(renderRows(rows))
        if (mem.narrative) {
          body.push(h('div', { className: 'mxov-sec', key: 'sn' }, '正文'))
          body.push(h('div', { className: 'mxov-pre', key: 'n' }, String(mem.narrative)))
        }
        if (mem.facts && mem.facts.length) {
          body.push(h('div', { className: 'mxov-sec', key: 'sf' }, '要点 (' + String(mem.facts.length) + ')'))
          body.push(h('ul', { className: 'mxov-list', key: 'f' }, mem.facts.map((x, i) => h('li', { key: i }, String(x)))))
        }
        if (mem.concepts && mem.concepts.length) {
          body.push(h('div', { className: 'mxov-sec', key: 'sc' }, '概念'))
          body.push(h('div', { className: 'mxov-chips', key: 'c' }, mem.concepts.map((x, i) => h('span', { className: 'mxov-chip', key: i }, String(x)))))
        }
        if (mem.filesModified && mem.filesModified.length) {
          body.push(h('div', { className: 'mxov-sec', key: 'sfl' }, '涉及文件'))
          body.push(h('ul', { className: 'mxov-list', key: 'fl' }, mem.filesModified.map((x, i) => h('li', { className: 'mxov-mono', key: i }, String(x)))))
        }
        if (mem.relatedCommits && mem.relatedCommits.length) {
          body.push(h('div', { className: 'mxov-sec', key: 'src' }, '关联提交'))
          body.push(h('div', { className: 'mxov-chips', key: 'rc' }, mem.relatedCommits.map((x, i) => h('span', { className: 'mxov-chip mxov-mono', key: i }, String(x)))))
        }
        if (mem.relatedEntities && mem.relatedEntities.length) {
          body.push(h('div', { className: 'mxov-sec', key: 'sre' }, '关联实体'))
          body.push(h('div', { className: 'mxov-chips', key: 're' }, mem.relatedEntities.map((x, i) => h('span', { className: 'mxov-chip', key: i }, String(x)))))
        }
        return h('div', { key: 'd' }, body)
      }

      // ── durable (long-term) memory views ────────────────────────────────
      const ltAll = (lt && lt.memories) || []
      const ltPasses = (m) => {
        if (ltStateFilter.length && ltStateFilter.indexOf(m.state) < 0) return false
        if (ltScopeFilter.length && ltScopeFilter.indexOf(m.scope) < 0) return false
        return true
      }
      const ltItems = ltAll.filter(ltPasses)

      function renderLongTermRow(m, key) {
        const retired = m.state === 'archived' || m.state === 'superseded'
        return h('div', {
          className: 'mxov-mem',
          key: key,
          'data-archived': retired ? 'true' : 'false',
          title: '点击查看详情',
          onClick: () => { setLtOpenId(m.id); setLtWritePhase('idle'); setLtWriteAction(null); setLtWriteErr(''); setLtWriteNote('') },
        }, [
          h('div', { className: 'mxov-memtitle', key: 't' }, [
            h('div', { className: 'mxov-memname', key: 'n' }, [
              h('span', { className: 'mxov-tdot', key: 'd', style: { background: ltStateColor(m.state) } }),
              String(m.title || '(无标题)'),
            ]),
            h('div', { className: 'mxov-memmeta', key: 'm' }, [
              h('span', { key: 's', style: { color: ltStateColor(m.state) } }, ltStateLabel(m.state)),
              ' · ' + ltKindLabel(m.kind),
              ' · ' + ltScopeLabel(m.scope) + ' / ' + String(m.portability || '-'),
              m.originProjectId ? '  ·  ' + m.originProjectId : '',
            ]),
          ]),
          h('span', { className: 'mxov-id', key: 'i' }, 'LT'),
        ])
      }

      function renderLongTermSection() {
        const body = [h('div', { className: 'mxov-sec', key: 'sec' }, '长期记忆 (' + String(ltAll.length) + ')')]
        if (ltPhase === 'loading' && lt === null) {
          body.push(h('div', { className: 'mxov-empty', key: 'l' }, '正在读取长期记忆…'))
          return h('div', { key: 'ltsection' }, body)
        }
        if (ltPhase === 'error') {
          body.push(h('div', { className: 'mxov-err', key: 'e' }, '长期记忆读取失败:host 半可能还没加载 long-term 动作(该插件更新了 host 半,需要重启一次 dsh-web)。'))
          return h('div', { key: 'ltsection' }, body)
        }
        if (!ltAll.length) {
          body.push(h('div', { className: 'mxov-empty', key: 'e' }, '还没有长期记忆。用 memorix memory long-term add --scope user --portability portable … 建立候选,再 qualify + approve 才算生效(候选/已确认都不会进入 Workset)。'))
          return h('div', { key: 'ltsection' }, body)
        }
        const states = LT_STATE_ORDER.filter((s) => ltAll.some((m) => m.state === s))
        const scopes = LT_SCOPE_ORDER.filter((s) => ltAll.some((m) => m.scope === s))
        body.push(h('div', { className: 'mxov-frow', key: 'fs' }, [h('span', { className: 'mxov-flabel', key: 'l' }, '状态')].concat(
          states.map((s, i) => h('button', {
            key: 's' + i,
            className: 'mxov-fchip',
            'data-on': ltStateFilter.indexOf(s) >= 0 ? 'true' : 'false',
            onClick: () => toggle(ltStateFilter, setLtStateFilter, s),
          }, ltStateLabel(s) + ' ' + String(ltAll.filter((m) => m.state === s).length))))))
        if (scopes.length > 1) {
          body.push(h('div', { className: 'mxov-frow', key: 'fsc' }, [h('span', { className: 'mxov-flabel', key: 'l' }, '作用域')].concat(
            scopes.map((s, i) => h('button', {
              key: 'c' + i,
              className: 'mxov-fchip',
              'data-on': ltScopeFilter.indexOf(s) >= 0 ? 'true' : 'false',
              onClick: () => toggle(ltScopeFilter, setLtScopeFilter, s),
            }, ltScopeLabel(s))))))
        }
        if (!ltItems.length) {
          body.push(h('div', { className: 'mxov-empty', key: 'none' }, '没有匹配的长期记忆'))
        } else {
          body.push(h('div', { className: 'mxov-proj', key: 'box' }, ltItems.map((m, i) => renderLongTermRow(m, 'lt' + String(m.id) + '-' + String(i)))))
        }
        return h('div', { key: 'ltsection' }, body)
      }

      function renderLongTermDetail() {
        const m = ltAll.filter((x) => x.id === ltOpenId)[0]
        const back = h('div', { className: 'mxov-back', key: 'back' },
          h('button', { className: 'mxov-btn', onClick: () => { setLtOpenId(null); setLtWritePhase('idle'); setLtWriteAction(null); setLtWriteErr(''); setLtWriteNote('') } }, '← 返回列表'))
        if (!m) {
          return h('div', { key: 'd' }, [back, h('div', { className: 'mxov-empty', key: 'e' }, '该长期记忆不在当前列表中(可能已被取代或归档),请刷新。')])
        }
        const rows = [
          { k: '状态', v: ltStateLabel(m.state) + ' (' + String(m.state) + ')' },
          { k: '作用域', v: ltScopeLabel(m.scope) + ' (' + String(m.scope) + ')' },
          { k: '可携带性', v: String(m.portability || '-') },
          { k: '类型', v: ltKindLabel(m.kind) + ' (' + String(m.kind) + ')' },
          { k: '来源', v: String(m.origin || '-') },
          { k: '起源项目', v: m.originProjectId || '-', mono: true },
          { k: '创建', v: ts(m.createdAt) },
          { k: '更新', v: ts(m.updatedAt) },
          { k: '合格于', v: m.qualifiedAt ? ts(m.qualifiedAt) : '-' },
          { k: '批准于', v: m.approvedAt ? ts(m.approvedAt) : '-' },
          { k: '归档于', v: m.archivedAt ? ts(m.archivedAt) : '-' },
          { k: '被取代为', v: m.supersededBy || '-', mono: true },
          { k: '访问次数', v: String(m.accessCount ?? 0) },
          { k: '证据 / 审计', v: String(m.evidence.length) + ' / ' + String(m.events.length) },
        ]
        const body = [back, h('div', { className: 'mxov-dtitle', key: 't' }, [
          h('span', { className: 'mxov-tdot', key: 'd', style: { background: ltStateColor(m.state) } }),
          String(m.title || '(无标题)'),
        ])]
        body.push(h('div', { className: 'mxov-sec', key: 'st' }, '长期记忆 · ' + ltStateLabel(m.state)))
        body.push(renderRows(rows))
        const busy = ltWritePhase === 'writing'
        const startAction = (action) => { setLtWriteAction(action); setLtWriteErr(''); setLtWriteNote(''); setLtWritePhase('confirm') }
        const actionButtons = []
        if (m.state === 'candidate') actionButtons.push(h('button', { key: 'q', className: 'mxov-btn', 'data-primary': 'true', disabled: busy, onClick: () => startAction('qualify') }, '确认 (qualify)'))
        if (m.state === 'qualified') actionButtons.push(h('button', { key: 'a', className: 'mxov-btn', 'data-primary': 'true', disabled: busy, onClick: () => startAction('approve') }, '批准 (approve)'))
        if (m.state === 'candidate' || m.state === 'qualified' || m.state === 'approved') {
          actionButtons.push(h('button', { key: 'r', className: 'mxov-btn', disabled: busy, onClick: () => startAction('archive') }, '归档'))
        }
        body.push(h('div', { className: 'mxov-sec', key: 'sact' }, '生命周期'))
        if (actionButtons.length) body.push(h('div', { className: 'mxov-frow', key: 'acts' }, actionButtons))
        else body.push(h('div', { className: 'mxov-empty', key: 'noact' }, '该记录已退役(已归档 / 已被取代),没有可用操作。'))
        if (ltWritePhase === 'confirm' && ltWriteAction) {
          body.push(h('div', { className: 'mxov-card', key: 'ltconfirm' }, [
            h('div', { key: 't', style: { marginBottom: '8px' } }, '确认对这条长期记忆执行「' + ltWriteAction + '」?状态机:candidate →(qualify)→ qualified →(approve)→ approved;候选与已确认都不进入 Workset,只有 approved 真正生效。'),
            h('label', { className: 'mxov-field', key: 'f', style: { marginBottom: '8px' } }, [
              h('span', { className: 'mxov-flabel2', key: 'l' }, '理由 reason(会写入审计事件)'),
              h('input', { key: 'i', className: 'mxov-input', value: ltWriteReason, onChange: (e) => setLtWriteReason(e.target.value) }),
            ]),
            h('div', { className: 'mxov-frow', key: 'a', style: { marginBottom: '0' } }, [
              h('button', { key: 'ok', className: 'mxov-btn', 'data-primary': 'true', disabled: busy, onClick: () => applyLtAction(m.id, ltWriteAction, m.originProjectId) }, '确认执行'),
              h('button', { key: 'no', className: 'mxov-btn', onClick: () => { setLtWritePhase('idle'); setLtWriteAction(null) } }, '取消'),
            ]),
          ]))
        }
        if (busy) body.push(h('div', { className: 'mxov-empty', key: 'ltw' }, '正在执行…'))
        if (ltWriteNote) body.push(h('div', { className: 'mxov-ok', key: 'ltn' }, ltWriteNote))
        if (ltWriteErr) body.push(h('div', { className: 'mxov-err', key: 'lte' }, ltWriteErr))
        if (m.applicability) {
          body.push(h('div', { className: 'mxov-sec', key: 'sa' }, '适用性'))
          body.push(h('div', { className: 'mxov-pre', key: 'a' }, String(m.applicability)))
        }
        if (m.content) {
          body.push(h('div', { className: 'mxov-sec', key: 'sc' }, '内容'))
          body.push(h('div', { className: 'mxov-pre', key: 'c' }, String(m.content)))
        }
        if (m.facts.length) {
          body.push(h('div', { className: 'mxov-sec', key: 'sf' }, '要点 (' + String(m.facts.length) + ')'))
          body.push(h('ul', { className: 'mxov-list', key: 'f' }, m.facts.map((x, i) => h('li', { key: i }, String(x)))))
        }
        if (m.tags.length) {
          body.push(h('div', { className: 'mxov-sec', key: 'stg' }, '标签'))
          body.push(h('div', { className: 'mxov-chips', key: 'g' }, m.tags.map((x, i) => h('span', { className: 'mxov-chip', key: i }, String(x)))))
        }
        if (m.evidence.length) {
          body.push(h('div', { className: 'mxov-sec', key: 'sev' }, '证据链'))
          body.push(h('ul', { className: 'mxov-list', key: 'ev' }, m.evidence.map((e, i) => h('li', { key: i },
            h('span', { className: 'mxov-mono' }, String(e.kind) + ' / ' + String(e.relation)),
            '  ' + String(e.referenceId || '').slice(0, 60) + (e.createdAt ? '  ·  ' + ts(e.createdAt) : '')))))
        }
        if (m.events.length) {
          body.push(h('div', { className: 'mxov-sec', key: 'sevt' }, '审计事件'))
          body.push(h('ul', { className: 'mxov-list', key: 'vt' }, m.events.map((e, i) => h('li', { key: i },
            String(e.kind) + ': ' + String(e.fromState ?? '—') + ' → ' + String(e.toState ?? '—') + '  ·  ' + ts(e.createdAt)))))
        }
        return h('div', { key: 'd' }, body)
      }

      function renderList() {
        const body = []
        const db = data.db || {}
        body.push(renderRows([
          { k: '记忆库', v: db.path || '-', mono: true },
          { k: '库大小', v: (db.missing ? '文件不存在' : fmtBytes(db.sizeBytes) + (db.walSizeBytes ? ' (+WAL ' + fmtBytes(db.walSizeBytes) + ')' : '')) },
          { k: '库更新时间', v: ts(db.updatedAt) },
          { k: 'CLI 版本', v: data.cliVersion || '未检测到(检查 config.bin)' },
          { k: '读取后端', v: data.backend || '-' },
          { k: '项目根', v: data.projectRoot || '-', mono: true },
        ]))
        if (totals) {
          body.push(h('div', { className: 'mxov-card', key: 'totals' }, h('div', { className: 'mxov-chips' }, [
            h('span', { className: 'mxov-chip', key: 'm' }, '记忆 ' + String(totals.memories)),
            h('span', { className: 'mxov-chip', key: 'p' }, '项目 ' + String(totals.projects)),
            h('span', { className: 'mxov-chip', key: 'a' }, '活跃 ' + String(totals.active)),
            h('span', { className: 'mxov-chip', key: 'ar' }, '归档 ' + String(totals.archived)),
            h('span', { className: 'mxov-chip', key: 'lt' }, '长期记忆 ' + String(totals.longTerm)),
            h('span', { className: 'mxov-chip', key: 'ms' }, '迷你技能 ' + String(totals.miniSkills)),
            h('span', { className: 'mxov-chip', key: 's' }, '会话 ' + String(totals.sessions)),
            h('span', { className: 'mxov-chip', key: 'e' }, '证据卡 ' + String(totals.evidenceCards)),
            h('span', { className: 'mxov-chip', key: 'k' }, '知识页 ' + String(totals.knowledgePages)),
          ])))
        }
        body.push(renderLongTermSection())
        if (storeAllowed) {
          body.push(h('div', { className: 'mxov-frow', key: 'newrow' }, [
            h('button', { className: 'mxov-btn', key: 'new', 'data-primary': 'true', onClick: () => { setComposing(true); setStage('edit'); setOpenId(null); setWriteErr('') } }, '+ 新建记忆'),
            writeNote ? h('span', { key: 'note', style: { fontSize: '11px', color: 'var(--dsw-alias-state-success-primary)' } }, writeNote) : null,
          ]))
        } else if (writeNote) {
          body.push(h('div', { className: 'mxov-ok', key: 'note' }, writeNote))
        }
        if (writeErr) body.push(h('div', { className: 'mxov-err', key: 'werr' }, writeErr))
        body.push(h('input', { key: 'search', className: 'mxov-search', placeholder: '搜索标题 / 实体 / 类型…', value: query, onChange: (e) => setQuery(e.target.value) }))
        body.push(h('div', { className: 'mxov-frow', key: 'ft' }, [h('span', { className: 'mxov-flabel', key: 'l' }, '类型')].concat(
          allTypes.map((t, i) => h('button', { key: 't' + i, className: 'mxov-fchip', 'data-on': typeFilter.indexOf(t.type) >= 0 ? 'true' : 'false', onClick: () => toggle(typeFilter, setTypeFilter, t.type) }, typeLabel(t.type) + ' ' + String(t.count))))))
        body.push(h('div', { className: 'mxov-frow', key: 'fs' }, [h('span', { className: 'mxov-flabel', key: 'l' }, '状态')].concat(
          STATUS_ORDER.map((s, i) => h('button', { key: 's' + i, className: 'mxov-fchip', 'data-on': statusFilter.indexOf(s) >= 0 ? 'true' : 'false', onClick: () => toggle(statusFilter, setStatusFilter, s) }, statusLabel(s))))))
        if (filtersActive) {
          body.push(h('div', { className: 'mxov-frow', key: 'fr' }, [
            h('span', { className: 'mxov-flabel', key: 'l' }, '命中 ' + String(matchCount) + ' 条'),
            h('button', { key: 'c', className: 'mxov-fchip', onClick: () => { setTypeFilter([]); setStatusFilter([]); setQuery('') } }, '清除筛选'),
          ]))
        }
        body.push(h('div', { className: 'mxov-sec', key: 'sech' }, '项目 (' + String(projects.length) + ')'))
        if (!projects.length) body.push(h('div', { className: 'mxov-empty', key: 'empty' }, 'Memorix 中还没有任何项目记忆'))
        else projects.forEach((p) => body.push(renderProject(p)))
        return h('div', { key: 'list' }, body)
      }

      function renderBody() {
        if (composing) return renderCompose()
        if (openId !== null) return renderDetail()
        if (ltOpenId !== null) return renderLongTermDetail()
        if (phase === 'loading' && !data) return h('div', { className: 'mxov-empty' }, '正在读取 Memorix 记忆…')
        if (phase === 'error' && !data) {
          return h('div', null, [
            h('div', { className: 'mxov-err', key: 'e' }, error),
            h('button', { className: 'mxov-btn', key: 'r', onClick: load }, '重试'),
          ])
        }
        if (!data) return h('div', { className: 'mxov-empty' }, '暂无数据')
        return renderList()
      }

      const headTitle = composing
        ? 'Memorix 记忆 · 新建'
        : (ltOpenId !== null ? 'Memorix 记忆 · 长期记忆' : (openId !== null ? 'Memorix 记忆 · 详情' : 'Memorix 记忆总览'))
      const head = h('div', { className: 'mxov-head', key: 'h' }, [
        h('span', { className: 'mxov-title', key: 't' }, headTitle),
        h('span', { className: 'mxov-sub', key: 's' }, phase === 'loading' ? '读取中…' : (data && data.generatedAt ? '更新于 ' + String(data.generatedAt).slice(11, 19) : '')),
        h('button', { className: 'mxov-btn', key: 'r', onClick: refreshAll, title: '刷新' }, '刷新'),
        variant !== 'tab' ? h('button', { className: 'mxov-btn', key: 'c', onClick: () => { setOpen(false); setOpenId(null); setComposing(false); setLtOpenId(null) }, title: '关闭' }, '关闭') : null,
      ])
      const body = h('div', { className: 'mxov-body', key: 'b' }, renderBody())

      if (variant === 'tab') {
        return h('div', { className: 'mxov-panel', 'data-variant': 'tab' }, [head, body])
      }

      const panelRef = React.useRef(null)
      React.useEffect(() => {
        const el = panelRef.current
        if (!el || !open) return
        if (typeof el.showPopover === 'function') {
          try { el.showPopover() } catch (e) { /* already open / unsupported */ }
        }
        const onToggle = (e) => {
          if (e && e.newState === 'closed') { setOpen(false); setOpenId(null); setComposing(false); setLtOpenId(null) }
        }
        el.addEventListener('toggle', onToggle)
        return () => {
          el.removeEventListener('toggle', onToggle)
          try { if (typeof el.hidePopover === 'function' && el.matches(':popover-open')) el.hidePopover() } catch (e) { /* detached */ }
        }
      }, [open])

      const entry = h('button', {
        className: 'mxov-entry',
        title: 'Memorix 记忆总览',
        onClick: () => setOpen((v) => !v),
      }, [
        h('span', { key: 'd', className: 'mxov-dot', 'data-state': dotState }),
        h('span', { key: 't' }, '记忆'),
        totals ? h('span', { key: 'c' }, String(totals.memories)) : null,
      ])

      return h(React.Fragment, null, [
        open ? null : entry,
        open ? h('div', { ref: panelRef, popover: 'auto', className: 'mxov-panel', 'data-variant': 'floating', key: 'panel' }, [head, body]) : null,
      ])
    }

    /** Tab icon for the better-sidebar workbench. */
    function panelIcon(size) {
      const s = typeof size === 'number' ? size : 16
      return h('svg', { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' }, [
        h('path', { key: 'a', d: 'M9.5 4.5h5a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2z' }),
        h('path', { key: 'b', d: 'M10.5 9h3M10.5 12h3M10.5 15h2' }),
      ])
    }

    function apply(ctx) {
      const disposeStyle = injectStyle()
      if (typeof disposeStyle === 'function') ctx.effect(() => disposeStyle, 'dsh-memorix-panel: styles')

      // Primary seat: a body-level mount that then parks itself INSIDE the
      // session header, immediately right of the shipped "Session 日志"
      // (Session log) button. Doing it by DOM lookup — not by the slot
      // service — keeps it independent of client-composition realms, where a
      // slot registration can silently land in a realm the visible UI never
      // reads. Until a session header exists the entry docks to the right edge
      // instead, and a MutationObserver re-parks it whenever the shell
      // re-renders or the session changes.
      const MOUNT_ID = 'dsh-memorix-panel-root'
      let mountedEdge = false
      if (typeof document !== 'undefined' && document.getElementById(MOUNT_ID) === null) {
        let reactDomClient
        try {
          reactDomClient = require('react-dom/client')
        } catch (error) {
          reactDomClient = undefined
        }
        if (reactDomClient !== undefined && typeof reactDomClient.createRoot === 'function') {
          const container = document.createElement('div')
          container.id = MOUNT_ID
          document.body.appendChild(container)
          const root = reactDomClient.createRoot(container)
          root.render(h(MemorixPanel, { variant: 'edge' }))

          /** The shipped session-log capsule this entry sits beside. */
          const findSessionLogButton = () => {
            const byClass = document.querySelector('button[class*="sessionLogButton"]')
            if (byClass !== null) return byClass
            for (const button of document.querySelectorAll('button')) {
              const label = (button.textContent ?? '').trim()
              if (label === 'Session 日志' || label === 'Session log') return button
            }
            return null
          }
          /** Park the entry beside that capsule, else dock it to the edge. */
          const place = () => {
            const logButton = findSessionLogButton()
            const row = logButton === null ? null : logButton.parentElement
            if (row !== null) {
              if (container.parentElement !== row) row.insertBefore(container, logButton.nextSibling)
              container.dataset.placement = 'header'
            } else if (container.parentElement !== document.body || container.dataset.placement !== 'edge') {
              document.body.appendChild(container)
              container.dataset.placement = 'edge'
            }
          }
          place()
          let frame = null
          const observer = new MutationObserver(() => {
            if (frame !== null) return
            frame = requestAnimationFrame(() => {
              frame = null
              place()
            })
          })
          observer.observe(document.body, { childList: true, subtree: true })

          ctx.effect(() => () => {
            observer.disconnect()
            if (frame !== null) cancelAnimationFrame(frame)
            try {
              root.unmount()
            } catch (error) {
              /* already detached */
            }
            if (container.parentNode !== null) container.parentNode.removeChild(container)
          }, 'dsh-memorix-panel: header entry')
          mountedEdge = true
        }
      }

      // Fallback seat when the body-level mount is unavailable: the shipped
      // session-header utilities (its panel still opens in the browser top
      // layer, so nothing can cover it).
      if (!mountedEdge) {
        const slots = ctx.get('slots')
        if (slots !== undefined && typeof slots.inject === 'function') {
          slots.inject('conversation.session.header.utilities', () => slots.register(
            { name: 'conversation.session.header.utilities', id: 'memorix-memory', order: 40, label: 'Memorix 记忆' },
            () => h(MemorixPanel, { variant: 'floating' }),
          ))
        }
      }

      // Bonus seat: a right-workbench tab in dsh-better-sidebar. It only lands
      // when this plugin instance shares the workbench's service instance
      // (same client-composition realm), so nothing relies on it.
      const betterSidebar = ctx.get('betterSidebar')
      if (betterSidebar !== undefined && typeof betterSidebar.registerTab === 'function') {
        ctx.effect(() => betterSidebar.registerTab({
          id: 'memorix',
          title: () => 'Memorix 记忆',
          icon: (size) => panelIcon(size),
          order: 60,
          component: () => h(MemorixPanel, { variant: 'tab' }),
        }), 'dsh-memorix-panel: better-sidebar tab')
      }
    }

    exports.apply = apply
    return module.exports
  },
})
