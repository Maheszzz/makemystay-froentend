import re

with open('src/views/Properties.tsx', 'r') as f:
    content = f.read()

# Replace apiParams logic
old_api_params = """        if (category === 'all') {
            return { ...base, property_type: typeFilter === 'all' ? undefined : typeFilter };
        }
        return { ...base, category };"""

new_api_params = """        if (category === 'all') {
            return { ...base, property_type: typeFilter === 'all' ? undefined : typeFilter };
        }
        return { ...base, category, property_type: typeFilter === 'all' ? undefined : typeFilter };"""

content = content.replace(old_api_params, new_api_params)

# Add typeOptions memo
type_options_str = """    const typeOptions = useMemo(() => {
        switch (category) {
            case 'pg':
                return [{ id: 'all', label: 'All Types' }, { id: 'PG', label: 'PG / Hostel' }, { id: 'Co-living', label: 'Co-living' }];
            case 'plot':
                return [{ id: 'all', label: 'All Types' }, { id: 'Plot', label: 'Plots / Land' }];
            case 'all':
            default:
                return [
                    { id: 'all', label: 'All Types' },
                    { id: '1RK', label: 'Studio (1 RK)' },
                    { id: '1BHK', label: '1 BHK' },
                    { id: '2BHK', label: '2 BHK' },
                    { id: '3BHK', label: '3 BHK' },
                    { id: 'Villa', label: 'Villa / Row House' },
                    { id: 'PG', label: 'PG / Hostel' },
                    { id: 'Plot', label: 'Plots / Land' }
                ];
        }
    }, [category]);

    return ("""

content = content.replace("    return (", type_options_str, 1)

# Replace the select options
old_select = """                                                <select
                                                    value={typeFilter}
                                                    onChange={(e) => setTypeFilter(e.target.value)}
                                                    className="w-full appearance-none px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 focus:ring-4 focus:ring-brand-red/5 outline-none pr-10 transition-all"
                                                >
                                                    <option value="all">All Types</option>
                                                    <option value="1RK">Studio (1 RK)</option>
                                                    <option value="1BHK">1 BHK</option>
                                                    <option value="2BHK">2 BHK</option>
                                                    <option value="3BHK">3 BHK</option>
                                                    <option value="Villa">Villa / Row House</option>
                                                </select>"""

new_select = """                                                <select
                                                    value={typeFilter}
                                                    onChange={(e) => setTypeFilter(e.target.value)}
                                                    className="w-full appearance-none px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 focus:ring-4 focus:ring-brand-red/5 outline-none pr-10 transition-all"
                                                >
                                                    {typeOptions.map(opt => (
                                                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                                                    ))}
                                                </select>"""

content = content.replace(old_select, new_select)

with open('src/views/Properties.tsx', 'w') as f:
    f.write(content)
