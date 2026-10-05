import React, { useState } from 'react';
import { Terminal, Play, CornerDownLeft, Sparkles } from 'lucide-react';

interface TerminalLog {
  type: 'input' | 'output' | 'system' | 'error';
  text: string;
}

export const MongoTerminalSimulator: React.FC = () => {
  const [dbMode, setDbMode] = useState<'mongo' | 'cassandra'>('mongo');
  const [currentDb, setCurrentDb] = useState<string>('test');
  const [collections, setCollections] = useState<Record<string, any[]>>({});
  const [inputVal, setInputVal] = useState<string>('');
  const [logs, setLogs] = useState<TerminalLog[]>([
    { type: 'system', text: 'MongoDB Shell v7.0.2 ready. Type `use <dbname>` or click quick buttons below.' }
  ]);

  const quickMongoActions = [
    { label: 'use examDB', cmd: 'use examDB' },
    { label: 'db (check active)', cmd: 'db' },
    { label: 'insertOne({name: "Pooja"})', cmd: 'db.students.insertOne({ name: "Pooja", marks: 92 })' },
    { label: 'show dbs', cmd: 'show dbs' },
    { label: 'db.students.find()', cmd: 'db.students.find()' }
  ];

  const quickCassandraActions = [
    {
      label: 'CREATE KEYSPACE',
      cmd: "CREATE KEYSPACE bank_ks WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};"
    },
    { label: 'USE bank_ks', cmd: 'USE bank_ks;' },
    { label: 'DESCRIBE KEYSPACES', cmd: 'DESCRIBE KEYSPACES;' }
  ];

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const newLogs: TerminalLog[] = [...logs, { type: 'input', text: (dbMode === 'mongo' ? '> ' : 'cqlsh> ') + trimmed }];

    if (dbMode === 'mongo') {
      if (trimmed.startsWith('use ')) {
        const target = trimmed.split(' ')[1];
        setCurrentDb(target);
        newLogs.push({ type: 'output', text: `switched to db ${target}` });
      } else if (trimmed === 'db') {
        newLogs.push({ type: 'output', text: currentDb });
      } else if (trimmed === 'show dbs') {
        const hasData = Object.keys(collections).length > 0;
        if (!hasData) {
          newLogs.push({
            type: 'output',
            text: `admin   0.000GB\nconfig  0.000GB\nlocal   0.000GB\n(Note: ${currentDb} is empty and hidden until first document inserted!)`
          });
        } else {
          newLogs.push({
            type: 'output',
            text: `admin   0.000GB\nconfig  0.000GB\nlocal   0.000GB\n${currentDb}  0.001GB`
          });
        }
      } else if (trimmed.includes('.insertOne(')) {
        const colName = trimmed.split('.')[1];
        const newRecord = { _id: '6520f92b7c4d8e001f3b89a1', name: 'Pooja', marks: 92 };
        const existing = collections[colName] || [];
        setCollections({ ...collections, [colName]: [...existing, newRecord] });
        newLogs.push({
          type: 'output',
          text: `{\n  acknowledged: true,\n  insertedId: ObjectId("${newRecord._id}")\n}`
        });
      } else if (trimmed.includes('.find(')) {
        const colName = trimmed.split('.')[1];
        const docs = collections[colName] || [];
        if (docs.length === 0) {
          newLogs.push({ type: 'output', text: 'No documents in collection.' });
        } else {
          newLogs.push({
            type: 'output',
            text: JSON.stringify(docs, null, 2)
          });
        }
      } else if (trimmed === 'clear') {
        setLogs([]);
        return;
      } else {
        newLogs.push({
          type: 'error',
          text: `Command not recognized. Try: use <db>, db, db.students.insertOne({...}), show dbs`
        });
      }
    } else {
      // Cassandra CQLSH
      if (trimmed.toUpperCase().startsWith('CREATE KEYSPACE')) {
        newLogs.push({
          type: 'output',
          text: 'Keyspace created successfully with SimpleStrategy replication.'
        });
      } else if (trimmed.toUpperCase().startsWith('USE ')) {
        const ks = trimmed.split(' ')[1]?.replace(';', '');
        newLogs.push({ type: 'output', text: `Connected to keyspace ${ks}.` });
      } else if (trimmed.toUpperCase().includes('DESCRIBE KEYSPACES')) {
        newLogs.push({
          type: 'output',
          text: 'system_schema  system  bank_ks  system_auth'
        });
      } else if (trimmed === 'clear') {
        setLogs([]);
        return;
      } else {
        newLogs.push({
          type: 'error',
          text: 'Try: CREATE KEYSPACE bank_ks WITH replication = ...; or USE bank_ks;'
        });
      }
    }

    setLogs(newLogs);
    setInputVal('');
  };

  const switchMode = (mode: 'mongo' | 'cassandra') => {
    setDbMode(mode);
    setLogs([
      {
        type: 'system',
        text:
          mode === 'mongo'
            ? 'Switched to MongoDB Shell. Learn db creation, collection, and insertOne syntax.'
            : 'Switched to Apache Cassandra cqlsh. Learn KEYSPACE creation and replication syntax.'
      }
    ]);
  };

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4 my-3 font-mono">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-semibold text-slate-200">Interactive Shell Simulator (Q25, Q26, Q27)</h4>
        </div>
        <div className="flex gap-1.5 text-xs">
          <button
            onClick={() => switchMode('mongo')}
            className={`px-2.5 py-1 rounded transition-all ${
              dbMode === 'mongo' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            🍃 MongoDB Shell
          </button>
          <button
            onClick={() => switchMode('cassandra')}
            className={`px-2.5 py-1 rounded transition-all ${
              dbMode === 'cassandra' ? 'bg-sky-600 text-white font-bold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            ⚡ Cassandra CQLSH
          </button>
        </div>
      </div>

      {/* Quick Action Chips */}
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        <span className="text-xs text-slate-400 flex items-center gap-1 self-center">
          <Sparkles className="w-3 h-3 text-amber-400" /> Exam Syntax:
        </span>
        {(dbMode === 'mongo' ? quickMongoActions : quickCassandraActions).map((act, i) => (
          <button
            key={i}
            onClick={() => handleCommand(act.cmd)}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded border border-slate-700 transition-colors"
          >
            {act.label}
          </button>
        ))}
      </div>

      {/* Terminal Screen */}
      <div className="bg-black/90 text-emerald-400 p-3 rounded-lg border border-slate-800 h-44 overflow-y-auto text-xs space-y-1 select-text">
        {logs.map((log, idx) => (
          <div
            key={idx}
            className={`whitespace-pre-wrap ${
              log.type === 'input'
                ? 'text-white font-bold'
                : log.type === 'system'
                ? 'text-slate-400 italic'
                : log.type === 'error'
                ? 'text-rose-400'
                : 'text-emerald-300'
            }`}
          >
            {log.text}
          </div>
        ))}
      </div>

      {/* Command input prompt */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCommand(inputVal);
        }}
        className="mt-2 flex gap-2"
      >
        <span className="text-xs text-slate-400 self-center">
          {dbMode === 'mongo' ? `${currentDb}>` : 'cqlsh>'}
        </span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={dbMode === 'mongo' ? 'e.g. use testDB or db.students.insertOne({...})' : 'e.g. CREATE KEYSPACE ...'}
          className="flex-1 bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-xs flex items-center gap-1 font-bold"
        >
          <Play className="w-3 h-3" /> Run
        </button>
      </form>
    </div>
  );
};
