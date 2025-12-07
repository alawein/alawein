import { motion } from 'framer-motion';
import { FileText, Search, Filter, ExternalLink, Download, Quote } from 'lucide-react';
import { useState } from 'react';

/**
 * Dr. M. Alowein Publications
 * Academic Portfolio - Family Platform
 */
const publications = [
  { id: 1, title: 'Machine Learning Applications in Materials Science', journal: 'Nature Materials', year: 2024, citations: 45, type: 'journal', doi: '10.1038/s41563-024-01234' },
  { id: 2, title: 'Quantum Computing for Molecular Simulation', journal: 'Physical Review Letters', year: 2023, citations: 89, type: 'journal', doi: '10.1103/PhysRevLett.130.12345' },
  { id: 3, title: 'AI-Driven Drug Discovery Pipeline', journal: 'Science Advances', year: 2023, citations: 156, type: 'journal', doi: '10.1126/sciadv.abc1234' },
  { id: 4, title: 'Deep Learning for Crystal Structure Prediction', journal: 'npj Computational Materials', year: 2023, citations: 78, type: 'journal', doi: '10.1038/s41524-023-01234' },
  { id: 5, title: 'Efficient Quantum Algorithms for Chemistry', journal: 'NeurIPS 2022', year: 2022, citations: 112, type: 'conference', doi: '' },
  { id: 6, title: 'Reinforcement Learning in Molecular Design', journal: 'ICML 2022', year: 2022, citations: 94, type: 'conference', doi: '' },
  { id: 7, title: 'Graph Neural Networks for Materials', journal: 'Nature Communications', year: 2022, citations: 203, type: 'journal', doi: '10.1038/s41467-022-12345' },
  { id: 8, title: 'Computational Methods in Drug Discovery', journal: 'Cambridge University Press', year: 2021, citations: 342, type: 'book', doi: '' },
];

const filters = ['All', 'Journal', 'Conference', 'Book'];

export default function Publications() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredPubs = publications.filter((pub) => {
    const matchesSearch = pub.title.toLowerCase().includes(search.toLowerCase()) || pub.journal.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'All' || pub.type === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const totalCitations = publications.reduce((sum, p) => sum + p.citations, 0);

  return (
    <div className="container pt-24 pb-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">PUBLICATIONS</span>
        </div>
        <h1 className="text-4xl font-bold mb-2">Research Publications</h1>
        <p className="text-muted-foreground mb-8">{publications.length} publications • {totalCitations.toLocaleString()} total citations</p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type="text" placeholder="Search publications..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:border-primary outline-none" />
        </div>
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button key={filter} onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeFilter === filter ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'}`}>
              {filter}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Publications List */}
      <div className="space-y-4">
        {filteredPubs.map((pub, index) => (
          <motion.div key={pub.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
            className="glass-card p-6 hover-card group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pub.type === 'journal' ? 'bg-blue-500/10 text-blue-500' : pub.type === 'conference' ? 'bg-purple-500/10 text-purple-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {pub.type}
                  </span>
                  <span className="text-sm text-muted-foreground">{pub.year}</span>
                </div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{pub.title}</h3>
                <p className="text-muted-foreground mt-1">{pub.journal}</p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground"><Quote className="w-4 h-4" /> {pub.citations} citations</span>
                  {pub.doi && <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline"><ExternalLink className="w-4 h-4" /> DOI</a>}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors" title="Download PDF"><Download className="w-5 h-5" /></button>
                <button className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors" title="Cite"><Quote className="w-5 h-5" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPubs.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No publications found matching your criteria</p>
        </div>
      )}
    </div>
  );
}

