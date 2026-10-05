import { QuestionTopic } from '../types/game';

export const QUESTION_BANK: QuestionTopic[] = [
  // ==========================================
  // REALM 1: TRANSACTIONS & ACID FOUNDATION
  // ==========================================
  {
    id: 'q3-transaction-def',
    qNumber: 3,
    title: 'Define Transaction with an Example',
    shortCode: 'TX-DEF',
    marks: '4',
    examWeight: 'medium',
    realm: 'transactions',
    realmName: 'Realm 1: Transaction Fundamentals',
    realmOrder: 1,
    isBoss: false,
    unlockedByDefault: true,
    teachBriefing: {
      coreDefinition: 'A Transaction is a logical unit of database processing that includes one or more database access operations (read, write, update, delete). It must be treated as atomic: either all operations complete or none do.',
      examKeyPoints: [
        'Definition: Single logical unit of work performed on database content.',
        'Boundary markers: BEGIN TRANSACTION, COMMIT (permanent save), ROLLBACK (undo changes on failure).',
        'Standard Example: Fund transfer of ₹5,000 from Account A to Account B.',
        'Operations sequence: Read(A) -> A = A - 5000 -> Write(A) -> Read(B) -> B = B + 5000 -> Write(B) -> Commit.'
      ],
      examProTips: [
        'Always write the exact sequence: Read(A) -> Write(A) -> Read(B) -> Write(B) -> Commit. Examiners award marks for mathematical/algebraic notation.',
        'Mention what happens if power fails after Write(A) to show why transaction boundaries matter.'
      ],
      modelAnswer4Marks: `Definition: A transaction is a collection of operations that form a single logical unit of work in a database.
Example: Transfer ₹5000 from Account A to Account B.
Step 1: Read(A)
Step 2: A = A - 5000
Step 3: Write(A)
Step 4: Read(B)
Step 5: B = B + 5000
Step 6: Write(B)
Step 7: Commit
If system crashes between Step 3 and Step 4, the transaction must ROLLBACK to prevent money loss.`
    },
    challenge: {
      title: 'Transaction Sequence Assembly',
      description: 'Analyze the banking transfer sequence and avoid corruption.',
      steps: [
        {
          id: 'step1',
          type: 'mcq',
          question: 'In a bank transfer from A (₹10,000) to B (₹5,000) of ₹2,000, what happens if the system crashes immediately after Write(A)?',
          options: [
            'Money is automatically credited to B after reboot',
            'A loses ₹2,000 while B receives nothing, violating Atomicity (Rollback required)',
            'The database automatically pauses until power returns without rolling back',
            'The transaction is committed partially'
          ],
          correctIndex: 1,
          explanation: 'If a failure occurs after Write(A), the database is in an inconsistent state. The transaction must rollback A back to ₹10,000.'
        },
        {
          id: 'step2',
          type: 'mcq',
          question: 'Which SQL command permanently persists the effects of a transaction to the disk?',
          options: ['SAVEPOINT', 'CHECKPOINT', 'COMMIT', 'PERSIST'],
          correctIndex: 2,
          explanation: 'COMMIT makes all updates made by the transaction durable and permanently stored in non-volatile storage.'
        }
      ]
    }
  },
  {
    id: 'q1-acid-properties',
    qNumber: 1,
    title: 'Explain ACID Properties of Transaction',
    shortCode: 'ACID',
    marks: '4/6',
    examWeight: 'high',
    realm: 'transactions',
    realmName: 'Realm 1: Transaction Fundamentals',
    realmOrder: 2,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'ACID represents the four essential properties that guarantee database transactions are processed reliably: Atomicity, Consistency, Isolation, and Durability.',
      examKeyPoints: [
        'Atomicity ("All-or-Nothing"): Entire transaction executes successfully or is completely aborted/undone (Recovery Manager / Undo Logs).',
        'Consistency: Preserves DB integrity constraints before and after execution (e.g., Total sum of A + B remains constant).',
        'Isolation: Concurrent execution of transactions yields same state as if executed serially without interference (Concurrency Control Manager).',
        'Durability: Once committed, updates persist even across hardware/power failures (Write-Ahead Logging / Redo Logs).'
      ],
      examProTips: [
        'Map each property to its DBMS component: Atomicity -> Transaction/Recovery Manager; Consistency -> Application Program & DBMS Constraints; Isolation -> Concurrency Control Manager; Durability -> Recovery Manager (WAL).',
        'For 6 marks, always draw the 4-box ACID diagram with one real banking failure scenario for each!'
      ],
      modelAnswer6Marks: `ACID Properties:
1. Atomicity: "All or Nothing". Either all operations execute or none. Handled by Recovery Manager using Log files.
   Example: If server fails mid-transfer, deduct from A is rolled back.
2. Consistency: Database remains in a valid state before and after transaction.
   Example: Sum of (Bal_A + Bal_B) before transfer = Sum after transfer.
3. Isolation: Transactions execute concurrently without interfering with each other. Intermediate states are invisible. Handled by Concurrency Control.
4. Durability: Once COMMIT is issued, data is permanently saved on disk, surviving power failure.`
    },
    challenge: {
      title: 'ACID Property Defender',
      description: 'Match the database failure scenario to the ACID property violated.',
      steps: [
        {
          id: 'acid-1',
          type: 'mcq',
          question: 'Transaction T1 reads uncommitted changes written by T2 before T2 aborts. Which ACID property is directly violated?',
          options: ['Atomicity', 'Isolation', 'Durability', 'Consistency'],
          correctIndex: 1,
          explanation: 'Isolation ensures that intermediate (uncommitted) data of one transaction cannot be seen or read by other concurrent transactions (preventing Dirty Reads).'
        },
        {
          id: 'acid-2',
          type: 'mcq',
          question: 'The server crashes 1 second after printing "Transaction Committed". Upon reboot, the data is gone. Which property was broken?',
          options: ['Durability', 'Atomicity', 'Isolation', 'Consistency'],
          correctIndex: 0,
          explanation: 'Durability promises that once a transaction commits, its modifications are permanently recorded on non-volatile storage.'
        }
      ]
    }
  },
  {
    id: 'q2-state-diagram',
    qNumber: 2,
    title: 'Draw & Explain State Diagram of Transactions',
    shortCode: 'TX-STATE',
    marks: '6',
    examWeight: 'high',
    realm: 'transactions',
    realmName: 'Realm 1: Transaction Fundamentals',
    realmOrder: 3,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'A transaction goes through 5 distinct states during its lifecycle: Active -> Partially Committed -> Committed, or Active / Partially Committed -> Failed -> Aborted (Terminated).',
      diagramType: 'state_machine',
      diagramDescription: 'Active --(after final statement)--> Partially Committed --(after commit written to log)--> Committed. Active/Partially Committed --(error/hardware crash)--> Failed --(rollback complete)--> Aborted.',
      examKeyPoints: [
        '1. Active: Initial state; stays active while executing read/write operations.',
        '2. Partially Committed: The final statement has executed, but updates are only in main memory buffer, not yet forced to disk/log.',
        '3. Committed: Transaction successfully stored changes permanently on disk; cannot be aborted.',
        '4. Failed: Normal execution can no longer proceed due to hardware or logical error.',
        '5. Aborted: Transaction has been rolled back and database restored to state prior to start. Can restart or kill.'
      ],
      examProTips: [
        'Crucial distinction: "Partially Committed" is NOT committed! It only means the final code statement ran, but logs are not yet flushed to non-volatile disk.',
        'Two options after Aborted state: (a) Restart transaction (if hardware/concurrency error), (b) Kill transaction (if internal logic/bad input error).'
      ],
      modelAnswer6Marks: `Transaction States:
1. Active: Beginning state where operations are executed.
2. Partially Committed: Reached after the final statement has been executed, but data is still in RAM.
3. Committed: Once log records are written to disk and changes become durable.
4. Failed: Entered when an error occurs during execution.
5. Aborted: Database is rolled back to previous consistent state; then transaction is either restarted or terminated.
[State Transitions]:
Active -> Partially Committed -> Committed
Active -> Failed -> Aborted
Partially Committed -> Failed -> Aborted`
    },
    challenge: {
      title: 'State Transition Navigator',
      description: 'Navigate a transaction through its valid state transitions.',
      steps: [
        {
          id: 'state-1',
          type: 'mcq',
          question: 'What is the precise state of a transaction immediately after its last SQL statement executes, but before disk sync?',
          options: ['Committed', 'Partially Committed', 'Active', 'Terminated'],
          correctIndex: 1,
          explanation: 'Partially Committed occurs after the final statement executes, when updates may still reside in memory buffers before disk write-ahead log flush.'
        },
        {
          id: 'state-2',
          type: 'mcq',
          question: 'Can a transaction transition directly from "Committed" to "Aborted"?',
          options: [
            'Yes, if the user asks for a refund',
            'No, once Committed, changes are permanent and cannot be aborted (compensating transaction needed instead)',
            'Yes, if the DBMS crashes within 5 minutes',
            'Yes, via standard ROLLBACK command'
          ],
          correctIndex: 1,
          explanation: 'By Durability, Committed is an absorbing terminal state. A committed transaction cannot be rolled back; only an inverse compensating transaction can offset it.'
        }
      ]
    }
  },
  {
    id: 'q5-advantages-concurrency',
    qNumber: 5,
    title: 'Give the Advantages of Concurrency in DBMS',
    shortCode: 'CONCUR-ADV',
    marks: '4',
    examWeight: 'medium',
    realm: 'transactions',
    realmName: 'Realm 1: Transaction Fundamentals',
    realmOrder: 4,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'Concurrency in DBMS allows multiple transactions to execute simultaneously, interleaving their operations across CPU and I/O subsystems.',
      examKeyPoints: [
        '1. Increased Processor & Disk Utilization: While one transaction waits for disk I/O, the CPU processes another transaction (no idle cores).',
        '2. Increased System Throughput: Number of transactions completed per unit time increases dramatically.',
        '3. Reduced Waiting Time (Lower Latency): Short transactions do not starve waiting behind long-running batch transactions.',
        '4. Improved User Response Time: Interactive desktop/web users get near-instantaneous feedback.'
      ],
      examProTips: [
        'Contrast sequential execution (Convoy effect where a 2-hour report blocks a 10ms balance check) with concurrent execution.',
        'State the dual benefits: Hardware efficiency (CPU/Disk overlap) + User experience (Lower turnaround time).'
      ],
      modelAnswer4Marks: `Advantages of Concurrency in DBMS:
1. Improved Throughput: Multiple transactions execute simultaneously, drastically increasing completed transactions per second.
2. High Hardware Utilization: CPU and I/O devices work in parallel; CPU executes Transaction T2 while T1 performs disk read.
3. Reduced Average Waiting Time: Prevents short transactions from getting blocked behind long-running batch queries (avoids Convoy effect).
4. Better Responsiveness: Critical for high-traffic multi-user applications like banking and airline reservations.`
    },
    challenge: {
      title: 'Concurrency Arbiter',
      description: 'Select the primary system reason for interleaving transactions.',
      steps: [
        {
          id: 'adv-1',
          type: 'mcq',
          question: 'If Transaction T1 takes 10 seconds (90% disk I/O) and T2 takes 100ms (CPU bound), what happens in serial vs concurrent execution?',
          options: [
            'Serial execution is faster because of zero locking overhead',
            'Concurrent execution allows T2 to complete during T1\'s idle I/O wait, slashing response time',
            'Both take exactly 10.1 seconds regardless of concurrency',
            'Concurrency doubles the disk read time'
          ],
          correctIndex: 1,
          explanation: 'Overlapping I/O and CPU utilization allows short jobs to finish without waiting for lengthy disk operations.'
        }
      ]
    }
  },

  // ==========================================
  // REALM 2: QUERY PROCESSING & OPTIMIZATION
  // ==========================================
  {
    id: 'q4-query-processing',
    qNumber: 4,
    title: 'Steps Involved in Query Processing & Optimization',
    shortCode: 'QUERY-OPT',
    marks: '6/8',
    examWeight: 'critical',
    realm: 'query_processing',
    realmName: 'Realm 2: Query Processing & Optimization',
    realmOrder: 5,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'Query Processing is the step-by-step translation of high-level declarative SQL into an efficient low-level procedural execution plan using relational algebra and cost estimation.',
      diagramType: 'query_pipeline',
      diagramDescription: 'SQL Query -> [1. Parsing & Translation (Syntax/Catalog check -> Relational Algebra)] -> [2. Optimization (Cost-based / Heuristic equivalence)] -> [3. Code Generator / Plan Generator] -> [4. Evaluation Engine -> Query Result]',
      examKeyPoints: [
        'Step 1: Parsing & Translation - Verifies syntax, table/column existence in data catalog, parses into parse tree, translates to relational algebra expression.',
        'Step 2: Query Optimization - Generates multiple equivalent evaluation plans; uses catalog statistics (catalog size, histogram, index availability) to choose plan with lowest estimated cost (I/O, CPU, disk blocks).',
        'Step 3: Code Generation / Plan Selection - Converts chosen relational algebra tree into executable primitives.',
        'Step 4: Execution / Evaluation Engine - Runs the query execution engine against the database and returns tuples.'
      ],
      examProTips: [
        'Cost metric: $Cost = t_T \\times N_{blocks} + t_S \\times N_{seeks} + CPU\\_time$. For university exams, highlight that disk I/O (block transfers) dominates the cost.',
        'Heuristic Rule to mention: "Perform Selection (σ) and Projection (π) as early as possible to minimize intermediate relation size before Joins."'
      ],
      modelAnswer8Marks: `Steps in Query Processing & Optimization:
1. Parsing and Translation:
   - Lexical analysis & syntax check.
   - Verifies table & attribute names against Data Dictionary/Catalog.
   - Translates SQL into initial Relational Algebra expression / Parse Tree.
2. Query Optimization (Core Phase):
   - Heuristic Optimization: Pushes selections (σ) and projections (π) down the tree to reduce intermediate tuple sizes.
   - Cost-Based Optimization: Evaluates alternative plans using catalog stats (# tuples, block count, index availability).
   - Cost calculation: Number of block transfers + Seek time.
3. Code Generation: Produces query evaluation plan with low-level instructions.
4. Evaluation Engine: Executes the compiled plan and outputs results.`
    },
    challenge: {
      title: 'Query Optimizer Engine',
      description: 'Order the execution phases and apply heuristic push-down optimization.',
      steps: [
        {
          id: 'qp-1',
          type: 'mcq',
          question: 'What is the golden heuristic rule of Relational Algebra query optimization?',
          options: [
            'Perform Cartesian Products first, then filter',
            'Push Selections (σ) and Projections (π) as deep down the tree as possible before performing Joins',
            'Always use full table scans instead of indexes',
            'Translate all Joins into nested loops without sorting'
          ],
          correctIndex: 1,
          explanation: 'Performing Selection early shrinks intermediate relation sizes drastically before expensive Join operations.'
        },
        {
          id: 'qp-2',
          type: 'mcq',
          question: 'Which component in the DBMS architecture houses statistics like number of tuples and index heights used by the Cost-Based Optimizer?',
          options: ['Buffer Pool', 'Data Dictionary / System Catalog', 'Transaction Log', 'Lock Table'],
          correctIndex: 1,
          explanation: 'The System Catalog (Data Dictionary) stores metadata, table sizes, page counts, and index statistics essential for cost estimation.'
        }
      ]
    }
  },
  {
    id: 'q8-subquery-and-join',
    qNumber: 8,
    title: 'SQL Query on Subquery and Join',
    shortCode: 'SQL-JOIN',
    marks: '4/6/8',
    examWeight: 'critical',
    realm: 'query_processing',
    realmName: 'Realm 2: Query Processing & Optimization',
    realmOrder: 6,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'Subqueries are nested queries enclosed in parentheses inside an outer query (used in WHERE, HAVING, or FROM). Joins combine rows from two or more tables based on a related column between them (INNER, LEFT, RIGHT, FULL).',
      examKeyPoints: [
        'Subquery: Scalar (returns single value with =, <, >), Multiple-row (returns list with IN, ANY, ALL), Correlated (inner query references outer query row).',
        'INNER JOIN: Returns records with matching values in both tables.',
        'LEFT OUTER JOIN: Returns all records from left table, and matched records from right table (NULL if no match).',
        'Standard Exam Question Pattern: Find employees whose salary is greater than the average salary of their department (Correlated Subquery) OR Join Employee & Department.'
      ],
      examProTips: [
        'Always write both a Subquery solution and an equivalent JOIN solution in 6/8 mark questions to impress the examiner!',
        'Show syntax: SELECT e.name, d.dname FROM Employee e INNER JOIN Department d ON e.dept_id = d.dept_id;'
      ],
      modelAnswer8Marks: `1. Subquery Example (Find employees earning more than overall average salary):
   SELECT emp_name, salary 
   FROM Employee 
   WHERE salary > (SELECT AVG(salary) FROM Employee);

2. Correlated Subquery Example (Salary greater than department average):
   SELECT e.emp_name, e.salary, e.dept_id 
   FROM Employee e 
   WHERE e.salary > (SELECT AVG(salary) FROM Employee WHERE dept_id = e.dept_id);

3. JOIN Example (Retrieve Employee names with their Department names):
   SELECT e.emp_name, d.dept_name, e.salary 
   FROM Employee e 
   INNER JOIN Department d ON e.dept_id = d.dept_id;

4. Comparison:
   - Subquery is easy to read for nested logic.
   - Joins are typically faster because DBMS optimizers can parallelize and hash/merge join them effectively.`
    },
    challenge: {
      title: 'SQL Code Master Challenge',
      description: 'Differentiate subquery behavior and join matching mechanics.',
      steps: [
        {
          id: 'sql-1',
          type: 'mcq',
          question: 'If table Employees has 5 rows and table Departments has 3 rows, what does a LEFT JOIN return if 1 employee has a NULL dept_id?',
          options: [
            'Only 4 rows',
            '5 rows (all employee rows, with NULL department columns for the unassigned employee)',
            '15 rows (Cartesian product)',
            '3 rows'
          ],
          correctIndex: 1,
          explanation: 'LEFT OUTER JOIN keeps all rows from the left table, padding missing right-table columns with NULL.'
        },
        {
          id: 'sql-2',
          type: 'mcq',
          question: 'What distinguishes a "Correlated Subquery" from an independent nested subquery?',
          options: [
            'Correlated subquery runs only once for the entire query',
            'Correlated subquery references columns from the outer query and re-evaluates for every outer row',
            'Correlated subquery never uses WHERE clauses',
            'Correlated subquery can only return strings'
          ],
          correctIndex: 1,
          explanation: 'A Correlated Subquery depends on values from the outer query row-by-row, requiring evaluation for each candidate row.'
        }
      ]
    }
  },

  // ==========================================
  // REALM 3: CONCURRENCY CONTROL & LOCKS
  // ==========================================
  {
    id: 'q10-lock-concepts',
    qNumber: 10,
    title: 'Concepts of LOCK in Concurrency Control',
    shortCode: 'LOCKS',
    marks: '4/6',
    examWeight: 'high',
    realm: 'concurrency_locks',
    realmName: 'Realm 3: Concurrency Control & Locks',
    realmOrder: 7,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'A Lock is a synchronization variable associated with a data item that controls concurrent access. It prevents conflicting operations (Write-Write, Read-Write) from compromising data consistency.',
      diagramType: 'lock_matrix',
      examKeyPoints: [
        '1. Shared Lock (S-Lock / Read Lock): Multiple transactions can acquire S-lock on item Q simultaneously for reading (Lock-S(Q)). No write allowed.',
        '2. Exclusive Lock (X-Lock / Write Lock): Only one transaction can hold X-lock on Q (Lock-X(Q)). Allows both read and write operations. No other transaction can hold any lock on Q.',
        '3. Lock Conversion: Upgrading (S -> X) and Downgrading (X -> S).',
        '4. Lock Manager maintains a Lock Table (hash table with lock records and request queues).'
      ],
      examProTips: [
        'Always specify the operations permitted: Shared = Read only, Exclusive = Read + Write.',
        'Explain that naive locking without protocols leads to deadlocks or non-serializable schedules.'
      ],
      modelAnswer6Marks: `Concepts of LOCK in Concurrency Control:
1. Definition: A lock is a mechanism to restrict concurrent access to a database item.
2. Modes of Locking:
   - Shared Mode (S-Lock): Requested for read-only access. Multiple transactions can hold S-locks concurrently.
     Syntax: lock-S(A) -> read(A) -> unlock(A).
   - Exclusive Mode (X-Lock): Requested for write operations. Gives exclusive access to one transaction.
     Syntax: lock-X(A) -> read(A) -> write(A) -> unlock(A).
3. Purpose: Enforces mutual exclusion on write operations to eliminate Dirty Reads, Lost Updates, and Inconsistent Analysis.`
    },
    challenge: {
      title: 'Lock Guard Simulator',
      description: 'Determine which lock requests are granted or placed in waiting queues.',
      steps: [
        {
          id: 'lock-1',
          type: 'mcq',
          question: 'Transaction T1 holds a Shared Lock (S) on item X. Transaction T2 requests an Exclusive Lock (X) on X. What happens?',
          options: [
            'Granted immediately',
            'T2 is blocked / queued until T1 releases the lock',
            'T1 is aborted immediately',
            'X-lock automatically downgrades to S-lock'
          ],
          correctIndex: 1,
          explanation: 'Exclusive lock is incompatible with Shared lock. T2 must wait until all Shared locks on X are released.'
        }
      ]
    }
  },
  {
    id: 'q23-compatibility-function',
    qNumber: 23,
    title: 'Give Compatibility Function',
    shortCode: 'COMPAT-FN',
    marks: '4',
    examWeight: 'medium',
    realm: 'concurrency_locks',
    realmName: 'Realm 3: Concurrency Control & Locks',
    realmOrder: 8,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'The Compatibility Function is represented as a matrix/function Comp(A, B) that defines whether a requested lock mode A can be granted on a data item while another transaction already holds lock mode B on that same item.',
      diagramType: 'lock_matrix',
      diagramDescription: 'Matrix: Mode Held (Row) vs Mode Requested (Column). Shared-Shared = TRUE. Shared-Exclusive = FALSE. Exclusive-Shared = FALSE. Exclusive-Exclusive = FALSE.',
      examKeyPoints: [
        'Shared + Shared = TRUE (Compatible, both can read simultaneously).',
        'Shared + Exclusive = FALSE (Incompatible, writer must wait for readers).',
        'Exclusive + Shared = FALSE (Incompatible, readers must wait for writer).',
        'Exclusive + Exclusive = FALSE (Incompatible, writer must wait for writer).',
        'Rule: Only (S, S) is compatible; any pair involving Exclusive (X) is incompatible.'
      ],
      examProTips: [
        'Draw the exact 2x2 grid in your answer sheet. Label rows as "Held Mode" and columns as "Requested Mode". Full 4 marks guaranteed!'
      ],
      modelAnswer4Marks: `Lock Compatibility Matrix:

                    Requested Mode
                     Shared (S)   | Exclusive (X)
  Held Mode -------------------------------------
  Shared (S)    |      TRUE       |    FALSE
  Exclusive (X) |     FALSE       |    FALSE

Explanation:
1. (S, S) = True: Multiple transactions can read the same data item simultaneously.
2. (S, X) & (X, S) = False: Reader and writer cannot access data concurrently (prevents Dirty Reads / Lost Updates).
3. (X, X) = False: Only one writer permitted at any instant (mutual exclusion).`
    },
    challenge: {
      title: 'Matrix Compatibility Matcher',
      description: 'Test your understanding of the compatibility function.',
      steps: [
        {
          id: 'compat-1',
          type: 'mcq',
          question: 'Under standard 2-mode locking, which combination is the ONLY compatible lock pair?',
          options: [
            '(Exclusive, Exclusive)',
            '(Shared, Exclusive)',
            '(Shared, Shared)',
            'All pairs are compatible if transactions belong to the same user'
          ],
          correctIndex: 2,
          explanation: '(Shared, Shared) is the sole compatible pair, allowing multiple simultaneous readers.'
        }
      ]
    }
  },
  {
    id: 'q12-2pl-protocol',
    qNumber: 12,
    title: 'Describe Two-Phase Locking (2PL) Protocol',
    shortCode: '2PL',
    marks: '6',
    examWeight: 'high',
    realm: 'concurrency_locks',
    realmName: 'Realm 3: Concurrency Control & Locks',
    realmOrder: 9,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'Two-Phase Locking (2PL) is a concurrency control protocol that guarantees conflict serializability by requiring each transaction to lock and unlock data items in two separate, non-overlapping phases: Growing Phase and Shrinking Phase.',
      diagramType: 'state_machine',
      diagramDescription: 'Phase 1: Growing Phase (Acquires locks, cannot release any lock) -> Lock Point (Peak where all locks are held) -> Phase 2: Shrinking Phase (Releases locks, cannot acquire any new lock).',
      examKeyPoints: [
        '1. Growing Phase: Transaction may obtain locks, but may not release any lock.',
        '2. Lock Point: The exact point in time when the transaction has acquired the final lock it requires.',
        '3. Shrinking Phase: Transaction may release locks, but may not acquire any new lock.',
        'Crucial Property: Basic 2PL ensures Conflict Serializability, but DOES NOT prevent Deadlocks or Cascading Rollbacks!',
        'Variations: Strict 2PL (holds all X-locks until commit; prevents cascading rollbacks), Rigorous 2PL (holds all S and X locks until commit).'
      ],
      examProTips: [
        'Draw the curve showing # of Locks held vs Time: goes up (Growing), hits peak (Lock Point), goes down (Shrinking).',
        'State clearly: "2PL guarantees conflict serializability, but can still lead to DEADLOCKS."'
      ],
      modelAnswer6Marks: `Two-Phase Locking (2PL) Protocol:
1. Growing Phase:
   - Transaction acquires all needed locks (Shared or Exclusive).
   - No locks can be released in this phase.
2. Lock Point:
   - The instance where transaction obtains its maximum/last lock.
3. Shrinking Phase:
   - Transaction releases locks one by one.
   - Once a lock is released, no new lock can be requested.

Guarantees & Limitations:
- Guarantees Conflict Serializability (Transactions serialize in order of their lock points).
- Does NOT prevent Deadlock (e.g. T1 holds A waiting for B; T2 holds B waiting for A).
- Strict 2PL solves cascading aborts by holding all Exclusive locks until COMMIT.`
    },
    challenge: {
      title: '2PL Phase Detective',
      description: 'Detect violations of the two-phase locking rule.',
      steps: [
        {
          id: '2pl-1',
          type: 'mcq',
          question: 'A transaction performs: Lock(A) -> Read(A) -> Unlock(A) -> Lock(B) -> Write(B) -> Unlock(B). Does it follow 2PL?',
          options: [
            'Yes, because all items are locked before being accessed',
            'No, it acquired Lock(B) after releasing Unlock(A), violating the 2PL shrinking phase rule',
            'Yes, provided A and B are in different tables',
            'No, because it did not use Exclusive locks'
          ],
          correctIndex: 1,
          explanation: 'In 2PL, once a transaction releases any lock (Unlock(A)), it enters the shrinking phase and CANNOT acquire any new lock (Lock(B)).'
        },
        {
          id: '2pl-2',
          type: 'mcq',
          question: 'What is the main benefit of Strict 2PL over Basic 2PL?',
          options: [
            'It eliminates deadlocks completely',
            'It prevents cascading rollbacks / cascading aborts by holding exclusive locks until Commit',
            'It eliminates the need for locking tables',
            'It allows simultaneous write-write operations'
          ],
          correctIndex: 1,
          explanation: 'Strict 2PL avoids cascading rollbacks because uncommitted writes cannot be read by other transactions until after commit.'
        }
      ]
    }
  },
  {
    id: 'q11-starvation',
    qNumber: 11,
    title: 'Explain Starvation of Transaction & Steps to Avoid It',
    shortCode: 'STARVATION',
    marks: '4',
    examWeight: 'medium',
    realm: 'concurrency_locks',
    realmName: 'Realm 3: Concurrency Control & Locks',
    realmOrder: 10,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'Starvation (Livelock) occurs when a transaction waits indefinitely for a resource/lock that is continuously granted to other concurrent transactions with higher priority or compatible modes.',
      examKeyPoints: [
        'Mechanism: Transaction T1 requests an Exclusive Lock (X) on Q. While T1 waits, a stream of other transactions (T2, T3, T4...) continually request Shared Locks (S). Because S is compatible with S, they are granted immediately, leaving T1 waiting forever.',
        'Another cause: In deadlock resolution, the victim selection algorithm repeatedly picks the same unlucky transaction for rollback.',
        'Steps to Avoid Starvation:',
        '1. FIFO Queue: Grant locks in strict First-Come-First-Served order (no new Shared locks granted if an Exclusive lock is waiting).',
        '2. Aging Mechanism: Increase transaction priority the longer it waits.',
        '3. Rollback Count Limit: Never pick a transaction as deadlock victim if it has been rolled back N times.'
      ],
      examProTips: [
        'Differentiate Starvation vs Deadlock: Deadlock = circular wait where NO transaction makes progress; Starvation = system makes progress, but ONE specific transaction is starved forever.'
      ],
      modelAnswer4Marks: `Starvation in DBMS:
Definition: Starvation occurs when a transaction is postponed indefinitely because the lock manager repeatedly grants the required data item to other transactions.
Example: T1 requests an Exclusive Lock on item Q. Meanwhile, new transactions T2, T3, T4 keep arriving requesting Shared Locks. The lock manager keeps granting S-locks, so T1 starves.

Steps to Avoid Starvation:
1. First-Come, First-Served (FCFS) Lock Granting: No new Shared lock is granted if an Exclusive lock is already waiting in the queue.
2. Aging Technique: Gradually increase priority of waiting transactions based on wait time.
3. Victim Selection Safeguard: Keep a count of how many times a transaction has been aborted so it is not repeatedly chosen as deadlock victim.`
    },
    challenge: {
      title: 'Starvation Buster',
      description: 'Implement the correct scheduling policy to prevent livelock.',
      steps: [
        {
          id: 'starv-1',
          type: 'mcq',
          question: 'How does Starvation differ from Deadlock?',
          options: [
            'In deadlock, all involved transactions are permanently stuck; in starvation, other transactions continue making progress while one is starved',
            'Starvation only occurs in NoSQL databases',
            'Deadlock can be resolved without rolling back any transaction',
            'Starvation is impossible when using locks'
          ],
          correctIndex: 0,
          explanation: 'Deadlock is a complete mutual standstill (cycle), whereas Starvation is unfairness where system throughput continues but one transaction suffers indefinite delay.'
        }
      ]
    }
  },
  {
    id: 'q13-deadlock-def',
    qNumber: 13,
    title: 'Define Deadlock with the Help of an Example',
    shortCode: 'DEADLOCK',
    marks: '6/8',
    examWeight: 'critical',
    realm: 'concurrency_locks',
    realmName: 'Realm 3: Concurrency Control & Locks',
    realmOrder: 11,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'Deadlock is an impasse situation where two or more transactions are in a simultaneous wait state, each waiting for a lock on a resource that is currently held by another transaction in the set, creating a circular dependency.',
      examKeyPoints: [
        'Conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.',
        'Classic 2-Transaction Example:',
        '  - Time t1: T1 holds Exclusive lock on A.',
        '  - Time t2: T2 holds Exclusive lock on B.',
        '  - Time t3: T1 requests Exclusive lock on B (T1 blocks, waiting for T2).',
        '  - Time t4: T2 requests Exclusive lock on A (T2 blocks, waiting for T1).',
        'Result: Neither can proceed. Circular wait cycle T1 -> T2 -> T1.',
        'Deadlock Handling Strategies: Detection (Wait-For Graph), Prevention (Wait-Die, Wound-Wait), Avoidance.'
      ],
      examProTips: [
        'Always draw the timeline table showing T1 and T2 operations step by step, followed by the circular arrow diagram T1 ⇄ T2.',
        'Mention the solution: System must abort one of the transactions (Victim Selection) and roll it back.'
      ],
      modelAnswer8Marks: `Deadlock in DBMS:
Definition: A deadlock occurs when a set of transactions are in a wait state because every transaction in the set holds a lock that another transaction needs, creating a circular wait.

Example:
Time | Transaction T1       | Transaction T2
---------------------------------------------
1    | Lock-X(Account_A)    | -
2    | -                    | Lock-X(Account_B)
3    | Lock-X(Account_B) [Waits for T2] | -
4    | -                    | Lock-X(Account_A) [Waits for T1]

Status:
- T1 cannot proceed until T2 releases Lock on B.
- T2 cannot proceed until T1 releases Lock on A.
- Both wait indefinitely; Deadlock occurs.

Deadlock Resolution:
1. Deadlock Detection: Build Wait-For Graph and detect cycles.
2. Recovery: Choose a victim transaction, rollback, and restart it.`
    },
    challenge: {
      title: 'Deadlock Impasse Scenario',
      description: 'Identify the circular wait condition.',
      steps: [
        {
          id: 'dl-1',
          type: 'mcq',
          question: 'If T1 holds Lock(A) and waits for Lock(B), T2 holds Lock(B) and waits for Lock(C), and T3 holds Lock(C) and waits for Lock(A), is this a deadlock?',
          options: [
            'No, because 3 transactions are involved instead of 2',
            'Yes, because a closed circular wait dependency exists: T1 -> T2 -> T3 -> T1',
            'No, because T3 can preempt T1 automatically',
            'Only if they are read-only transactions'
          ],
          correctIndex: 1,
          explanation: 'Any closed directed cycle of wait dependencies (T1 -> T2 -> T3 -> T1) creates an unresolvable deadlock without intervention.'
        }
      ]
    }
  },
  {
    id: 'q14-wait-for-graph',
    qNumber: 14,
    title: 'Explain Wait-For Graph for Deadlock Detection',
    shortCode: 'WFG',
    marks: '6',
    examWeight: 'high',
    realm: 'concurrency_locks',
    realmName: 'Realm 3: Concurrency Control & Locks',
    realmOrder: 12,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'A Wait-For Graph (WFG) is a directed graph G = (V, E) used for deadlock detection, where vertices V represent active transactions and directed edges E represent wait dependencies.',
      diagramType: 'wait_for_graph',
      diagramDescription: 'Vertices: {T1, T2, T3}. Directed edge Ti -> Tj exists if and only if transaction Ti is waiting for transaction Tj to release a lock on a data item. Deadlock condition: A deadlock exists if and only if the Wait-For Graph contains a directed cycle.',
      examKeyPoints: [
        'Construction Rule: Add directed edge Ti -> Tj whenever Ti requests a lock on an item currently locked by Tj.',
        'Removal Rule: When Tj releases the lock and Ti obtains it, erase edge Ti -> Tj.',
        'Detection Algorithm: Run cycle detection algorithms (Depth First Search / Tarjan) periodically on WFG.',
        'Recovery upon cycle detection:',
        '  1. Selection of Victim (based on cost, age, or fewest locks held).',
        '  2. Rollback (Partial rollback to checkpoint or Total abort).',
        '  3. Starvation prevention (track victim abort count).'
      ],
      examProTips: [
        'Draw an example with 4 nodes: T1 -> T2 -> T3 -> T4, then an edge T4 -> T2 (cycle: T2 -> T3 -> T4 -> T2, so deadlock!). T1 is waiting, but not in the cycle.',
        'Emphasize the theorem: "In a single-instance resource system, a directed cycle in WFG is both NECESSARY and SUFFICIENT for deadlock."'
      ],
      modelAnswer6Marks: `Wait-For Graph (WFG) for Deadlock Detection:
1. Formal Definition:
   - Vertices (V): All active transactions {T1, T2, ..., Tn}.
   - Directed Edges (E): Edge Ti -> Tj exists if Ti is waiting for Tj to release a lock on a data item.
2. Detection Criterion:
   - A deadlock exists if and only if the Wait-For Graph contains at least one directed cycle.
3. Example:
   - T1 holds A, T2 holds B.
   - T1 requests B -> Edge T1 -> T2 is created.
   - T2 requests A -> Edge T2 -> T1 is created.
   - Cycle detected: T1 -> T2 -> T1 => System is in DEADLOCK.
4. Recovery Action:
   - Select a victim transaction (e.g. youngest or lowest cost).
   - Rollback the victim to release its locks and break the cycle.`
    },
    challenge: {
      title: 'Cycle Spotter Mini-Game',
      description: 'Trace the edges of the Wait-For Graph to identify deadlocks.',
      steps: [
        {
          id: 'wfg-1',
          type: 'mcq',
          question: 'In a WFG: T1 -> T2, T2 -> T3, T3 -> T4, and T4 -> T1. Is the system in a deadlock?',
          options: [
            'No, because T4 will finish first',
            'Yes, a directed cycle T1 -> T2 -> T3 -> T4 -> T1 exists, proving deadlock',
            'No, because graph has 4 vertices',
            'Only if all transactions are write operations'
          ],
          correctIndex: 1,
          explanation: 'The existence of a closed directed cycle in the Wait-For Graph indicates that each transaction is waiting on the next, creating an inescapable deadlock.'
        },
        {
          id: 'wfg-2',
          type: 'mcq',
          question: 'If edge T4 -> T2 exists while T1 -> T2, T2 -> T3, and T3 -> T4, which transactions are part of the deadlock cycle?',
          options: [
            'All transactions T1, T2, T3, T4',
            'Only {T2, T3, T4}',
            'Only {T1, T2}',
            'No deadlock exists'
          ],
          correctIndex: 1,
          explanation: 'T1 points into T2, but is not part of the closed cycle: T2 -> T3 -> T4 -> T2. Aborting T1 would NOT resolve the deadlock!'
        }
      ]
    }
  },

  // ==========================================
  // REALM 4: SERIALIZABILITY & SCHEDULES
  // ==========================================
  {
    id: 'q18-cascade-cascadeless',
    qNumber: 18,
    title: 'Explain Cascade and Cascadeless Schedule',
    shortCode: 'CASCADE',
    marks: '6',
    examWeight: 'high',
    realm: 'serializability',
    realmName: 'Realm 4: Serializability & Schedules',
    realmOrder: 13,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'A Cascading Schedule (Cascading Rollback / Cascading Abort) is one where the failure of one transaction causes a chain reaction of rolling back multiple dependent transactions. A Cascadeless Schedule strictly prevents this by prohibiting transactions from reading uncommitted data.',
      examKeyPoints: [
        'Cascading Schedule: T1 writes A. T2 reads A written by T1. T3 reads B written by T2. If T1 fails and aborts, T2 must abort (read dirty data), which in turn forces T3 to abort.',
        'Problem: Enormous CPU and I/O waste rolling back dozens of innocent transactions.',
        'Cascadeless Schedule Definition: For each pair of transactions Ti and Tj such that Tj reads a data item previously written by Ti, the commit operation of Ti appears BEFORE the read operation of Tj.',
        'Formula: Commit(Ti) < Read_j(Q).'
      ],
      examProTips: [
        'Remember the hierarchy: Serial Schedules ⊂ Cascadeless Schedules ⊂ Recoverable Schedules.',
        'Cascadeless schedules avoid Dirty Reads!'
      ],
      modelAnswer6Marks: `Cascading vs Cascadeless Schedules:
1. Cascading Schedule (Cascading Rollback):
   - Occurs when aborting one transaction forces dependent transactions to abort in a chain reaction.
   - Example:
     T1: Write(A)
     T2: Read(A), Write(B)
     T3: Read(B)
     If T1 aborts, T2 must abort (it read uncommitted A). Then T3 must abort (it read uncommitted B).
   - Drawback: Severe performance degradation.

2. Cascadeless Schedule:
   - A schedule where transactions read ONLY committed data items.
   - Condition: If Tj reads data item written by Ti, then Ti must COMMIT before Tj performs its read.
   - Example:
     T1: Write(A), Commit
     T2: Read(A), Write(B), Commit
   - Benefit: No cascading rollbacks are ever triggered.`
    },
    challenge: {
      title: 'Dirty Read Neutralizer',
      description: 'Analyze schedule execution to ensure cascadeless guarantees.',
      steps: [
        {
          id: 'casc-1',
          type: 'mcq',
          question: 'What exact condition makes a schedule Cascadeless?',
          options: [
            'All transactions must execute strictly one after another without concurrency',
            'Every transaction must only read data items written by transactions that have already committed',
            'Transactions are not allowed to write to the same data item',
            'Transactions must never commit'
          ],
          correctIndex: 1,
          explanation: 'Cascadeless schedules enforce Commit(Ti) < Read_j(Q), preventing any transaction from reading uncommitted dirty values.'
        }
      ]
    }
  },
  {
    id: 'q16-conflict-serializability',
    qNumber: 16,
    title: 'Explain Conflict Serializability with Example',
    shortCode: 'CONF-SER',
    marks: '8',
    examWeight: 'critical',
    realm: 'serializability',
    realmName: 'Realm 4: Serializability & Schedules',
    realmOrder: 14,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'A schedule S is Conflict Serializable if it can be transformed into an equivalent serial schedule S\' by a series of swaps of non-conflicting concurrent instructions.',
      diagramType: 'precedence_graph',
      diagramDescription: 'Precedence Graph: Node for each Ti. Directed edge Ti -> Tj if Ti executes an operation that conflicts with an operation of Tj and Ti executes first. If the Precedence Graph has NO CYCLES (is a DAG), the schedule is Conflict Serializable.',
      examKeyPoints: [
        'Conflicting Operations: Two operations Ii and Ij conflict if and only if:',
        '  1. They belong to different transactions (Ti ≠ Tj).',
        '  2. They access the exact same data item Q.',
        '  3. At least one of them is a WRITE operation (Write(Q)).',
        'Three conflict types: Read-Write (RW), Write-Read (WR), Write-Write (WW). Non-conflicting: Read-Read (RR) - can always be swapped!',
        'Precedence Graph (Serialization Graph): Draw arrow Ti -> Tj for every conflict. No cycle = Conflict Serializable!'
      ],
      examProTips: [
        'Always state the 3 conditions for conflicting operations in bold!',
        'If asked for equivalent serial schedule, write down the Topological Sort of the precedence graph (e.g., T1 -> T2 -> T3).'
      ],
      modelAnswer8Marks: `Conflict Serializability:
1. Conflicting Instructions: Two operations I_i and I_j conflict if:
   - They belong to different transactions.
   - They access the same data item.
   - At least one instruction is a WRITE operation.
   Pairs:
   - Read(A) and Read(A) -> Non-conflicting (can be swapped)
   - Read(A) and Write(A) -> Conflicting
   - Write(A) and Read(A) -> Conflicting
   - Write(A) and Write(A) -> Conflicting

2. Precedence Graph (Serialization Graph) Method:
   - Vertices: One node for each active transaction.
   - Directed Edges: Edge Ti -> Tj is drawn if an operation of Ti precedes and conflicts with an operation of Tj.
   - Theorem: Schedule S is conflict serializable IF AND ONLY IF its precedence graph has NO directed cycles.
   - The equivalent serial schedule is given by the Topological Sort of the graph.`
    },
    challenge: {
      title: 'Conflict Pair Analyzer',
      description: 'Identify conflicting vs swappable operations in concurrent schedules.',
      steps: [
        {
          id: 'cs-1',
          type: 'mcq',
          question: 'Which of the following operation pairs CAN be swapped without altering the schedule outcome?',
          options: [
            'T1: Read(A) and T2: Write(A)',
            'T1: Write(A) and T2: Write(A)',
            'T1: Read(A) and T2: Read(A)',
            'T1: Write(A) and T2: Read(A)'
          ],
          correctIndex: 2,
          explanation: 'Two Read operations on the same data item never conflict because reading does not modify state. They are commutative and can be swapped safely.'
        },
        {
          id: 'cs-2',
          type: 'mcq',
          question: 'If the Precedence Graph of a schedule has edges T1 -> T2 and T2 -> T3, is the schedule conflict serializable, and what is its equivalent serial order?',
          options: [
            'Not serializable because it is not cyclic',
            'Serializable, with equivalent serial order T1 -> T2 -> T3',
            'Serializable, with equivalent serial order T3 -> T2 -> T1',
            'Not serializable because T1 does not connect directly to T3'
          ],
          correctIndex: 1,
          explanation: 'The graph is an acyclic DAG. Its topological sort is T1 -> T2 -> T3, representing the equivalent serial order.'
        }
      ]
    }
  },
  {
    id: 'q17-view-serializability',
    qNumber: 17,
    title: 'Describe View Serializability with Example',
    shortCode: 'VIEW-SER',
    marks: '8',
    examWeight: 'critical',
    realm: 'serializability',
    realmName: 'Realm 4: Serializability & Schedules',
    realmOrder: 15,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'A schedule S is View Serializable if it is view equivalent to a serial schedule S\'. View serializability is less restrictive than conflict serializability: Every conflict serializable schedule is view serializable, but not vice-versa!',
      examKeyPoints: [
        'Three Rules for View Equivalence between Schedule S and Serial Schedule S\':',
        '  1. Initial Read: For each data item Q, if Ti reads the initial value in S, Ti must read the initial value in S\'.',
        '  2. Read-from (Updated Read): If Ti reads a value of Q written by Tj in S, then Ti must read the value of Q written by Tj in S\'.',
        '  3. Final Write: For each data item Q, if Ti performs the final write on Q in S, Ti must perform the final write on Q in S\'.',
        'Blind Writes: A write without a prior read (Write(Q) without Read(Q)). View serializable schedules that are NOT conflict serializable ALWAYS contain Blind Writes!'
      ],
      examProTips: [
        'Venn diagram tip: Draw Conflict Serializable inside View Serializable inside All Schedules.',
        'High-yield quote: "Testing for Conflict Serializability is O(V+E) (polynomial time), but testing for View Serializability is NP-Complete!"'
      ],
      modelAnswer8Marks: `View Serializability:
1. Definition: Schedule S is view serializable if it is view equivalent to some serial schedule S'.
2. Three Conditions for View Equivalence:
   - Initial Read Rule: If Ti reads initial value of data item A in S, Ti must read initial value of A in S'.
   - Updated Read Rule: If Ti reads A written by Tj in S, Ti must read A written by Tj in S'.
   - Final Write Rule: If Ti performs the final write on A in S, Ti must perform the final write on A in S'.
3. Blind Write Significance:
   - A schedule containing no blind writes is view serializable IF AND ONLY IF it is conflict serializable.
   - Schedules that are view serializable but not conflict serializable must contain at least one BLIND WRITE.`
    },
    challenge: {
      title: 'View Equivalence Checker',
      description: 'Check initial reads, final writes, and blind write rules.',
      steps: [
        {
          id: 'vs-1',
          type: 'mcq',
          question: 'What special type of operation allows a schedule to be View Serializable even when its Precedence Graph has a cycle (i.e. not Conflict Serializable)?',
          options: ['Dirty Read', 'Blind Write (Write without preceding Read)', 'Cascade Read', 'Shared Lock'],
          correctIndex: 1,
          explanation: 'Blind writes (overwriting a value without reading it first) allow schedules to satisfy view equivalence conditions despite having cycles in the conflict precedence graph.'
        }
      ]
    }
  },
  {
    id: 'q9-boss-conflict-numerical',
    qNumber: 9,
    title: 'Numerical on Conflict & View Serializability',
    shortCode: 'BOSS-SER',
    marks: '4/6',
    examWeight: 'critical',
    realm: 'serializability',
    realmName: 'Realm 4: Serializability & Schedules',
    realmOrder: 16,
    isBoss: true,
    bossData: {
      bossId: 'boss-serializability-titan',
      bossName: 'The Serializability Titan',
      title: 'Master of Precedence Graphs & Blind Writes',
      avatar: '🗿',
      maxHp: 100,
      marks: '4/6',
      numericalQuestion: 'Given Schedule S with transactions T1, T2, T3: S = R1(A), R2(A), R1(B), W2(A), R3(B), W1(B), W3(B). (a) Draw Precedence Graph, (b) Determine if S is Conflict Serializable, (c) If serializable, find equivalent serial schedule, (d) Check for View Serializability.',
      backgroundStory: 'The Serializability Titan tests your step-by-step conflict analysis! Compute the conflict pairs, test for cycles, and strike down the titan with mathematical precision!',
      victoryRewardXp: 350,
      steps: [
        {
          stepNumber: 1,
          title: 'Phase 1: Identify Conflicting Pairs on Data Item A',
          instruction: 'Trace operations on item A: R1(A), R2(A), W2(A). Which directed edge is generated in the Precedence Graph?',
          scheduleContext: 'Operations on A: R1(A) -> R2(A) -> W2(A)',
          question: 'Does R1(A) conflict with W2(A), and what edge does it produce?',
          workingHint: 'R1(A) comes first, W2(A) comes later. Since one is Write and they are different transactions, this is a Read-Write conflict from T1 to T2.',
          options: [
            {
              label: 'No conflict because R2(A) is in between',
              isCorrect: false,
              damageToBoss: 0,
              explanation: 'False. R1(A) and W2(A) access the same item A and W2 is a write operation, so an edge T1 -> T2 is mandatory.'
            },
            {
              label: 'Edge T1 -> T2 (R1(A) conflicts with subsequent W2(A))',
              isCorrect: true,
              damageToBoss: 35,
              explanation: 'CRITICAL HIT! R1(A) precedes W2(A). Since W2(A) is a write on the same item, it creates directed edge T1 -> T2.'
            },
            {
              label: 'Edge T2 -> T1',
              isCorrect: false,
              damageToBoss: 0,
              explanation: 'Incorrect arrow direction. Edge always flows from earlier transaction to later transaction.'
            }
          ]
        },
        {
          stepNumber: 2,
          title: 'Phase 2: Trace Conflicting Pairs on Data Item B',
          instruction: 'Operations on B: R1(B) -> R3(B) -> W1(B) -> W3(B). Trace all conflicts between T1 and T3.',
          scheduleContext: 'R1(B) precedes W3(B); R3(B) precedes W1(B); W1(B) precedes W3(B).',
          question: 'Analyze R3(B) followed by W1(B), and W1(B) followed by W3(B). What edges are created?',
          workingHint: 'Notice R3(B) precedes W1(B) (edge T3 -> T1). But W1(B) also precedes W3(B) (edge T1 -> T3)! Look closely for cycles!',
          options: [
            {
              label: 'Only edge T1 -> T3 is created',
              isCorrect: false,
              damageToBoss: 0,
              explanation: 'Incomplete. R3(B) executes BEFORE W1(B), which also creates an edge T3 -> T1.'
            },
            {
              label: 'Both edges T3 -> T1 (from R3(B) to W1(B)) AND T1 -> T3 (from W1(B) to W3(B)) are created, forming a CYCLE!',
              isCorrect: true,
              damageToBoss: 35,
              explanation: 'MASSIVE BLOW! R3(B) -> W1(B) gives T3 -> T1. Later, W1(B) -> W3(B) gives T1 -> T3. This creates a directed cycle T1 ⇄ T3!'
            },
            {
              label: 'No edges because operations on B are commutative',
              isCorrect: false,
              damageToBoss: 0,
              explanation: 'Incorrect. Write operations are never commutative with Reads or Writes on the same item.'
            }
          ]
        },
        {
          stepNumber: 3,
          title: 'Phase 3: Final Verdict on Serializability',
          instruction: 'The Precedence Graph contains directed edges: T1 -> T2, T3 -> T1, and T1 -> T3. Give the final exam conclusion!',
          scheduleContext: 'Cycle: T1 -> T3 -> T1 exists in the Precedence Graph.',
          question: 'Is Schedule S Conflict Serializable, and is it View Serializable?',
          workingHint: 'A cycle in the precedence graph proves it is NOT conflict serializable. Because there are no blind writes, can it be view serializable?',
          options: [
            {
              label: 'It is Conflict Serializable with order T2 -> T1 -> T3',
              isCorrect: false,
              damageToBoss: 0,
              explanation: 'A graph with a cycle can NEVER be Conflict Serializable!'
            },
            {
              label: 'NOT Conflict Serializable (due to cycle T1 ⇄ T3). Also NOT View Serializable (no blind writes exist to resolve the cycle).',
              isCorrect: true,
              damageToBoss: 35,
              explanation: 'TITAN DEFEATED! Perfect exam conclusion. The cycle T1 ⇄ T3 rules out Conflict Serializability. Since every write has a preceding read (no blind writes), it is also NOT View Serializable.'
            }
          ]
        }
      ]
    },
    teachBriefing: {
      coreDefinition: 'Numerical problem solving for Conflict and View Serializability: (1) List operations by timestamp, (2) Find all (RW, WR, WW) conflicts for each item, (3) Draw the Precedence Graph, (4) Test for cycles, (5) Check for blind writes if cycles exist.',
      diagramType: 'precedence_graph',
      examKeyPoints: [
        'Methodical Algorithm for Full Marks:',
        '1. Separate data items (Group A ops, Group B ops).',
        '2. For each item, compare all pairs (Ti, Tj) where i ≠ j.',
        '3. If at least one is Write and Ti executes before Tj, add directed edge Ti -> Tj.',
        '4. If acyclic -> Conflict Serializable, write topological order.',
        '5. If cyclic -> Check for Blind Writes (Write without prior Read). If NO blind writes exist, it CANNOT be View Serializable either.'
      ],
      examProTips: [
        'Exam Pro-Tip: Memorize this rule: "If a schedule contains NO blind writes, then Conflict Serializability ≡ View Serializability." Writing this fetches immediate bonus marks!'
      ],
      modelAnswer6Marks: `Numerical Solution:
Schedule S = R1(A), R2(A), R1(B), W2(A), R3(B), W1(B), W3(B).

Step 1: Conflicts on Data Item A:
- R1(A) -> W2(A): Edge T1 -> T2.

Step 2: Conflicts on Data Item B:
- R1(B) -> W3(B): Edge T1 -> T3.
- R3(B) -> W1(B): Edge T3 -> T1.
- W1(B) -> W3(B): Edge T1 -> T3.

Step 3: Graph Analysis:
Edges: {T1 -> T2, T3 -> T1, T1 -> T3}.
We observe a directed cycle between T1 and T3: T1 -> T3 -> T1.

Conclusion:
(a) S is NOT conflict serializable because its precedence graph contains a cycle.
(b) S has no blind writes (all transactions read before writing). Therefore, S is also NOT view serializable.`
    },
    challenge: {
      title: 'Boss Numerical Battle Ready',
      description: 'Engage the Serializability Titan in combat using your graph skills.',
      steps: []
    }
  },

  // ==========================================
  // REALM 5: TIMESTAMP & VALIDATION PROTOCOLS
  // ==========================================
  {
    id: 'q6-timestamp-protocol',
    qNumber: 6,
    title: 'Explain Timestamp Based Protocols',
    shortCode: 'TS-PROTO',
    marks: '8',
    examWeight: 'critical',
    realm: 'timestamp_proto',
    realmName: 'Realm 5: Timestamp & Validation Protocols',
    realmOrder: 17,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'Timestamp-Based Protocol is a non-locking concurrency control mechanism where each transaction Ti is assigned a unique monotonically increasing timestamp TS(Ti) upon creation. Conflicting operations are executed in exact timestamp order.',
      examKeyPoints: [
        'Timestamps: TS(Ti) assigned via System Clock or Logical Counter.',
        'Data Item Timestamps:',
        '  - W-TS(Q): Largest timestamp of any transaction that executed Write(Q) successfully.',
        '  - R-TS(Q): Largest timestamp of any transaction that executed Read(Q) successfully.',
        'Read Rule for Ti executing Read(Q):',
        '  - If TS(Ti) < W-TS(Q): Ti is trying to read an overwritten old value. REJECT and ROLLBACK Ti (Assign new TS on restart).',
        '  - If TS(Ti) >= W-TS(Q): GRANT Read(Q). Update R-TS(Q) = max(R-TS(Q), TS(Ti)).',
        'Write Rule for Ti executing Write(Q):',
        '  - If TS(Ti) < R-TS(Q): A younger transaction has already read Q. REJECT and ROLLBACK Ti.',
        '  - If TS(Ti) < W-TS(Q): Ti is trying to write an obsolete value. In Basic TO, REJECT and ROLLBACK Ti. (In Thomas Write Rule, just ignore/skip!).',
        '  - Otherwise: GRANT Write(Q). Update W-TS(Q) = TS(Ti).'
      ],
      examProTips: [
        'Vital Distinction: Timestamp protocol guarantees Conflict Serializability and FREEDOM FROM DEADLOCK (because transactions never wait, they either proceed or abort)!',
        'Mention Thomas Write Rule as an optimization that skips obsolete writes instead of aborting.'
      ],
      modelAnswer8Marks: `Timestamp-Based Protocol:
1. Timestamp Assignment:
   Each transaction Ti is assigned timestamp TS(Ti) upon entry.
   Every data item Q maintains:
   - W-TS(Q): Largest TS of any transaction that wrote Q.
   - R-TS(Q): Largest TS of any transaction that read Q.

2. Timestamp Ordering Protocol Rules:
   [Operation: Ti requests Read(Q)]
   - If TS(Ti) < W-TS(Q): Abort and rollback Ti (value needed was already overwritten).
   - If TS(Ti) >= W-TS(Q): Execute Read(Q); set R-TS(Q) = max(R-TS(Q), TS(Ti)).

   [Operation: Ti requests Write(Q)]
   - If TS(Ti) < R-TS(Q): Abort and rollback Ti (younger transaction already read old value).
   - If TS(Ti) < W-TS(Q): Abort and rollback Ti (obsolete write).
   - Otherwise: Execute Write(Q); set W-TS(Q) = TS(Ti).

3. Key Advantages:
   - Deadlock-free (No transaction ever waits).
   - Guarantees Conflict Serializability.`
    },
    challenge: {
      title: 'Timestamp Arbiter',
      description: 'Decide whether read/write requests are granted or rolled back.',
      steps: [
        {
          id: 'ts-1',
          type: 'mcq',
          question: 'Data item X has W-TS(X) = 15, R-TS(X) = 20. Transaction T with TS(T) = 12 requests Read(X). What is the protocol action?',
          options: [
            'Grant Read(X) and set R-TS(X) = 20',
            'Rollback T because TS(T) < W-TS(X) (12 < 15)',
            'Grant Read(X) and decrement W-TS(X)',
            'Put T into a wait queue until W-TS resets'
          ],
          correctIndex: 1,
          explanation: 'Since TS(T) < W-TS(X) (12 < 15), T is trying to read an older value that has already been overwritten by a younger transaction. T must be aborted and rolled back.'
        },
        {
          id: 'ts-2',
          type: 'mcq',
          question: 'Why is the Timestamp Ordering protocol guaranteed to be free of Deadlocks?',
          options: [
            'Because it locks all items at the start',
            'Because transactions never wait for locks; they either execute immediately or get rolled back',
            'Because it only allows one transaction at a time',
            'Because it uses two-phase locking'
          ],
          correctIndex: 1,
          explanation: 'No transaction ever waits in a queue holding resources. If an operation violates the ordering rules, the transaction is immediately rolled back.'
        }
      ]
    }
  },
  {
    id: 'q7-validation-protocol',
    qNumber: 7,
    title: 'Explain Validation Based Protocol',
    shortCode: 'VALID-PROTO',
    marks: '8',
    examWeight: 'critical',
    realm: 'timestamp_proto',
    realmName: 'Realm 5: Timestamp & Validation Protocols',
    realmOrder: 18,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'Validation-Based Protocol (also called Optimistic Concurrency Control) assumes conflicts are rare. Transactions execute without locks in local private workspaces and validate conflicts only before committing.',
      examKeyPoints: [
        'Three Phases in Transaction Lifecycle:',
        '  1. Read & Execution Phase: Reads values from database into private workspace. All write operations are performed ONLY on local copies, not on the actual database.',
        '  2. Validation Phase: Performs validation test to check if updates violate serializability with concurrent transactions.',
        '  3. Write Phase: If validation succeeds, local updates are written permanently to the database. If validation fails, transaction is aborted and local workspace discarded.',
        'Timestamps assigned during Validation Phase: Start(Ti), Validation(Ti), Finish(Ti).',
        'Validation Condition between Ti and Tj (where TS(Ti) < TS(Tj)):',
        '  - Condition 1: Finish(Ti) < Start(Tj) (Pure serial execution).',
        '  - Condition 2: Start(Tj) < Finish(Ti) < Validation(Tj) AND WriteSet(Ti) ∩ ReadSet(Tj) = ∅.'
      ],
      examProTips: [
        'Highlight why it is called "Optimistic": best suited for read-heavy workloads where conflict rate is very low (e.g. decision support systems, web browsing).',
        'Mention the 3 timestamps assigned: Start(Ti), Validation(Ti), Finish(Ti).'
      ],
      modelAnswer8Marks: `Validation-Based (Optimistic) Protocol:
1. Philosophy: Assumes conflicts are rare. Avoids locking overhead during execution.
2. Three Distinct Phases:
   a. Read Phase:
      - Reads data items from database into local memory variables.
      - Writes are performed on local copies only (no DB modifications).
   b. Validation Phase:
      - Occurs when transaction finishes execution.
      - DBMS checks if local changes conflict with other concurrent transactions.
      - If validation passes, proceeds to write phase; else transaction aborts.
   c. Write Phase:
      - Updates are applied from local workspace to the physical database.

3. Validation Rules (for TS(Ti) < TS(Tj)):
   - Rule 1: Ti finishes before Tj starts: Finish(Ti) < Start(Tj).
   - Rule 2: Write-set of Ti does not overlap with Read-set of Tj:
     WriteSet(Ti) ∩ ReadSet(Tj) = ∅.

4. Advantages:
   - Deadlock-free, high throughput for read-intensive databases.`
    },
    challenge: {
      title: 'Optimistic Phase Validator',
      description: 'Audit the three phases of optimistic concurrency control.',
      steps: [
        {
          id: 'val-1',
          type: 'mcq',
          question: 'Where are write operations executed during the "Read Phase" of a validation-based protocol?',
          options: [
            'Directly on the physical database disk blocks',
            'In the transaction\'s private local workspace / RAM buffer',
            'Directly into the transaction log file',
            'In the shared buffer pool'
          ],
          correctIndex: 1,
          explanation: 'In the Read phase, all writes are isolated to local copies in private workspace so uncommitted changes never alter database state.'
        },
        {
          id: 'val-2',
          type: 'mcq',
          question: 'When is the official serializability timestamp TS(Ti) assigned to a transaction in the Validation protocol?',
          options: [
            'At the very moment it starts execution',
            'At the start of its Validation Phase',
            'After it writes all updates to disk',
            'When the database server boots up'
          ],
          correctIndex: 1,
          explanation: 'Timestamps are assigned when validation begins, ensuring the serial order matches the validation sequence.'
        }
      ]
    }
  },
  {
    id: 'q15-boss-timestamp-numerical',
    qNumber: 15,
    title: 'Numerical on Timestamp Based Protocols',
    shortCode: 'BOSS-TS',
    marks: '6',
    examWeight: 'critical',
    realm: 'timestamp_proto',
    realmName: 'Realm 5: Timestamp & Validation Protocols',
    realmOrder: 19,
    isBoss: true,
    bossData: {
      bossId: 'boss-chronos-core',
      bossName: 'Chronos the Timestamp Titan',
      title: 'Keeper of R-TS and W-TS Clocks',
      avatar: '⏳',
      maxHp: 100,
      marks: '6',
      numericalQuestion: 'Given Transactions T1, T2, T3 with timestamps TS(T1)=100, TS(T2)=150, TS(T3)=200. Initial R-TS(X)=0, W-TS(X)=0. Sequence of operations: (1) T1: Read(X), (2) T2: Write(X), (3) T3: Read(X), (4) T1: Write(X). Trace each step, update timestamps, and state which transaction is aborted.',
      backgroundStory: 'Chronos challenges you to enforce Basic Timestamp Ordering rules! Evaluate each transaction request step-by-step to destroy the temporal anomaly!',
      victoryRewardXp: 350,
      steps: [
        {
          stepNumber: 1,
          title: 'Step 1: T1 executes Read(X)',
          instruction: 'TS(T1)=100. Current state: W-TS(X)=0, R-TS(X)=0. Evaluate T1: Read(X).',
          scheduleContext: 'T1 with TS=100 asks to read X.',
          question: 'Does Read rule allow T1 to read X, and what is the new R-TS(X)?',
          workingHint: 'Rule: If TS(Ti) >= W-TS(X), granted! R-TS(X) becomes max(old, TS(Ti)).',
          options: [
            {
              label: 'Grant Read(X). New R-TS(X) = 100, W-TS(X) = 0',
              isCorrect: true,
              damageToBoss: 35,
              explanation: 'DIRECT HIT! 100 >= 0, so read is granted. R-TS(X) becomes max(0, 100) = 100.'
            },
            {
              label: 'Abort T1 because TS(T1) is smaller than T2',
              isCorrect: false,
              damageToBoss: 0,
              explanation: 'False. Timestamp ordering compares TS(T1) against item timestamps (W-TS), not other unstarted transactions.'
            }
          ]
        },
        {
          stepNumber: 2,
          title: 'Step 2: T2 executes Write(X) and T3 executes Read(X)',
          instruction: 'State: R-TS(X)=100, W-TS(X)=0. Next: T2(TS=150) requests Write(X), then T3(TS=200) requests Read(X).',
          scheduleContext: 'Evaluate T2: Write(X) then T3: Read(X).',
          question: 'Are both operations granted, and what are the resulting R-TS(X) and W-TS(X)?',
          workingHint: 'For T2 Write: TS(T2)=150 >= R-TS(100) and >= W-TS(0) -> Grant! W-TS(X)=150. For T3 Read: TS(T3)=200 >= W-TS(150) -> Grant! R-TS(X)=200.',
          options: [
            {
              label: 'Both granted. State becomes R-TS(X) = 200, W-TS(X) = 150',
              isCorrect: true,
              damageToBoss: 35,
              explanation: 'SUPER EFFECTIVE! T2 Write updates W-TS(X)=150. Then T3 Read updates R-TS(X)=200.'
            },
            {
              label: 'T2 is aborted because R-TS(X) is already 100',
              isCorrect: false,
              damageToBoss: 0,
              explanation: 'False. TS(T2) = 150 > 100, so it is allowed to write.'
            }
          ]
        },
        {
          stepNumber: 3,
          title: 'Step 3: The Fatal Request — T1: Write(X)',
          instruction: 'Current State: R-TS(X)=200, W-TS(X)=150. Now old transaction T1(TS=100) attempts Write(X).',
          scheduleContext: 'T1(TS=100) issues Write(X) against R-TS(X)=200.',
          question: 'What is the action of the Timestamp Ordering protocol on T1: Write(X)?',
          workingHint: 'Check Write Rule: Is TS(T1) < R-TS(X)? Here 100 < 200! T3 has already read a younger value!',
          options: [
            {
              label: 'Grant Write(X) and overwrite W-TS(X) to 100',
              isCorrect: false,
              damageToBoss: 0,
              explanation: 'Violates protocol! If allowed, T3 would have read an inconsistent future value.'
            },
            {
              label: 'REJECT and ROLLBACK T1! Because TS(T1) < R-TS(X) (100 < 200), meaning a younger transaction already read X.',
              isCorrect: true,
              damageToBoss: 35,
              explanation: 'CHRONOS SHATTERED! 100 < 200 violates the write rule. T1 must be aborted and rolled back with a new timestamp!'
            }
          ]
        }
      ]
    },
    teachBriefing: {
      coreDefinition: 'Numerical procedure for Timestamp Protocol exam questions: Maintain a table with columns [Step #, Transaction, Operation, TS(Ti), R-TS(Q), W-TS(Q), Action (Grant/Rollback)]. Apply read/write rules at every step.',
      examKeyPoints: [
        'Step 1: Check Read condition: TS(Ti) < W-TS(Q) -> Rollback; else Grant and R-TS = max.',
        'Step 2: Check Write condition 1: TS(Ti) < R-TS(Q) -> Rollback.',
        'Step 3: Check Write condition 2: TS(Ti) < W-TS(Q) -> Rollback (or Thomas rule skip).',
        'Step 4: If passed: W-TS = TS(Ti).'
      ],
      examProTips: [
        'Draw the exact tabular trace. State clearly: "At Step 4, TS(T1) = 100 < R-TS(X) = 200, hence T1 is aborted and restarted."'
      ],
      modelAnswer6Marks: `Numerical Trace:
Given: TS(T1)=100, TS(T2)=150, TS(T3)=200. Initial R-TS(X)=0, W-TS(X)=0.

Step 1: T1: Read(X)
- TS(T1)=100 >= W-TS(X)=0 -> Granted!
- Updated: R-TS(X) = max(0, 100) = 100.

Step 2: T2: Write(X)
- TS(T2)=150 >= R-TS(X)=100 and >= W-TS(X)=0 -> Granted!
- Updated: W-TS(X) = 150.

Step 3: T3: Read(X)
- TS(T3)=200 >= W-TS(X)=150 -> Granted!
- Updated: R-TS(X) = max(100, 200) = 200.

Step 4: T1: Write(X)
- TS(T1)=100 < R-TS(X)=200.
- Condition TS(Ti) < R-TS(X) is triggered!
- Action: T1 is REJECTED, ABORTED, and ROLLED BACK.`
    },
    challenge: {
      title: 'Chronos Boss Challenge',
      description: 'Engage Chronos in battle to master the numerical trace.',
      steps: []
    }
  },

  // ==========================================
  // REALM 6: NOSQL, MONGODB & CASSANDRA
  // ==========================================
  {
    id: 'q19-nosql-features',
    qNumber: 19,
    title: 'Enlist Key Features of NoSQL Database',
    shortCode: 'NOSQL-FEAT',
    marks: '4',
    examWeight: 'medium',
    realm: 'nosql_modern',
    realmName: 'Realm 6: Modern NoSQL (MongoDB & Cassandra)',
    realmOrder: 20,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'NoSQL ("Not Only SQL") databases are non-relational, distributed data management systems designed for horizontal scalability, schema flexibility, and high-velocity unstructured/semi-structured big data.',
      examKeyPoints: [
        '1. Non-Relational & Schema-less (Dynamic Schema): Fields can vary from document to document without altering table definitions.',
        '2. Horizontal Scalability (Scale-Out): Scales by adding commodity hardware servers via sharding/partitioning rather than upgrading a single expensive server.',
        '3. BASE Model instead of ACID: Basically Available, Soft state, Eventual consistency.',
        '4. Distributed Architecture: Automatic data replication, partitioning, and fault tolerance across clusters.',
        '5. Handles Massive Unstructured/Semi-Structured Data (JSON, BSON, Key-Value pairs).'
      ],
      examProTips: [
        'List 4 clear bullet points: Schema-less, Horizontal Scalability, BASE consistency model, High Availability through replication.'
      ],
      modelAnswer4Marks: `Key Features of NoSQL Databases:
1. Schema-Free / Dynamic Schema: Records do not have to conform to a rigid predefined schema; documents can add new attributes dynamically.
2. Horizontal Scalability (Scale-Out): Easily scales across clusters of commodity servers using automatic sharding/partitioning.
3. BASE Consistency Model: Follows Basically Available, Soft state, Eventual consistency rather than strict ACID.
4. High Availability & Fault Tolerance: Built-in masterless or master-slave replication ensures zero downtime during hardware failures.
5. Optimized for Big Data: Extremely high read/write speeds on petabytes of unstructured and semi-structured data.`
    },
    challenge: {
      title: 'NoSQL Trait Identifier',
      description: 'Differentiate NoSQL characteristics from traditional RDBMS.',
      steps: [
        {
          id: 'nosql-1',
          type: 'mcq',
          question: 'What does "Horizontal Scalability" mean in NoSQL architecture?',
          options: [
            'Upgrading to a more expensive CPU and adding more RAM to a single machine (Scale-Up)',
            'Adding more standard commodity computing nodes/servers to the cluster (Scale-Out)',
            'Increasing the number of columns in a table',
            'Storing data across multiple hard drive partitions on one computer'
          ],
          correctIndex: 1,
          explanation: 'Horizontal scaling (scale-out) distributes the dataset across many interconnected servers, allowing virtually limitless capacity growth.'
        }
      ]
    }
  },
  {
    id: 'q20-nosql-adv-disadv',
    qNumber: 20,
    title: 'State Advantages & Disadvantages of NoSQL Databases',
    shortCode: 'NOSQL-PRO-CON',
    marks: '4/6',
    examWeight: 'high',
    realm: 'nosql_modern',
    realmName: 'Realm 6: Modern NoSQL (MongoDB & Cassandra)',
    realmOrder: 21,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'While NoSQL offers extraordinary scale and agile development, it trades off ACID transaction guarantees and standardized complex querying.',
      examKeyPoints: [
        'Advantages:',
        '  - Elastic Scalability: Seamlessly scale storage and throughput across servers.',
        '  - High Performance: Eliminates costly table joins; fast reads/writes.',
        '  - Schema Flexibility: Rapid development without expensive ALTER TABLE migrations.',
        '  - Low Cost: Runs on inexpensive commodity hardware.',
        'Disadvantages:',
        '  - Eventual Consistency: Stale reads possible; lacks strict multi-record ACID.',
        '  - Lack of Standardization: No universal query standard (MongoDB uses MQL, Cassandra uses CQL, Neo4j uses Cypher).',
        '  - Limited Complex Analytics: Complex joins and nested aggregations are difficult or slow.',
        '  - Smaller Community & Maturity compared to 40-year-old RDBMS ecosystems.'
      ],
      examProTips: [
        'Draw a 2-column table with 3 advantages on left and 3 disadvantages on right. Examiners love clean comparison tables!'
      ],
      modelAnswer6Marks: `Advantages and Disadvantages of NoSQL:

Advantages:
1. Massive Scalability: Horizontal clustering allows petabytes of data across distributed nodes.
2. Agile Schema: Documents/keys can adapt instantly to changing software requirements without downtime.
3. High Performance: Avoids multi-table relational joins by embedding documents.
4. High Availability: Automatic replication ensures system survives node crashes.

Disadvantages:
1. No Strict ACID Guarantee: Most prioritize availability over immediate consistency (Eventual Consistency).
2. Query Limitations: Lack of standardized SQL joins makes complex relational reporting difficult.
3. No Universal Standard: Different proprietary query languages across MongoDB, Cassandra, and Redis.
4. Tool Maturity: Less mature backup, auditing, and reporting tools compared to Oracle/MySQL.`
    },
    challenge: {
      title: 'Trade-Off Evaluator',
      description: 'Choose the best database paradigm based on system requirements.',
      steps: [
        {
          id: 'trade-1',
          type: 'mcq',
          question: 'Which application requirement is a classic disadvantage/misuse of NoSQL databases?',
          options: [
            'Social media activity feed with millions of daily posts',
            'Strict core banking ledger requiring multi-table atomic money transfers with zero tolerance for inconsistency',
            'IoT temperature sensor telemetry ingestion',
            'Product catalog with rapidly evolving dynamic specifications'
          ],
          correctIndex: 1,
          explanation: 'Core banking accounting requires strict ACID transactions across multiple accounts, where traditional relational databases or NewSQL excel.'
        }
      ]
    }
  },
  {
    id: 'q21-sql-vs-nosql',
    qNumber: 21,
    title: 'Differentiate Between SQL and NoSQL Databases Briefly',
    shortCode: 'SQL-VS-NOSQL',
    marks: '4/6',
    examWeight: 'high',
    realm: 'nosql_modern',
    realmName: 'Realm 6: Modern NoSQL (MongoDB & Cassandra)',
    realmOrder: 22,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'SQL (Relational) databases are structured, table-based systems governed by rigid schemas and ACID rules, while NoSQL databases are distributed, document/key/column-based systems prioritizing scalability and flexible schemas.',
      examKeyPoints: [
        'Comparison Parameters for Full Marks:',
        '1. Data Model: Relational Tables (Rows & Columns) vs Documents, Key-Value, Columnar, Graphs.',
        '2. Schema: Predefined rigid schema vs Dynamic/Schema-less.',
        '3. Scaling: Vertical (Scale-up single machine) vs Horizontal (Scale-out cluster).',
        '4. Transaction Model: ACID (Atomicity, Consistency, Isolation, Durability) vs BASE (Basically Available, Soft-state, Eventual consistency).',
        '5. Query Language: Structured SQL vs Document/API specific (CQL, MQL).',
        '6. Examples: PostgreSQL, MySQL, Oracle vs MongoDB, Cassandra, Redis.'
      ],
      examProTips: [
        'Write down at least 5 distinct parameters: Data Model, Schema, Scaling, Integrity, and Example.'
      ],
      modelAnswer6Marks: `Difference Between SQL and NoSQL Databases:

Parameter          | SQL (Relational DB)             | NoSQL (Non-Relational DB)
-------------------|----------------------------------|----------------------------------
1. Data Model      | Tabular (Rows and Columns)      | Key-Value, Document, Column, Graph
2. Schema          | Fixed / Pre-defined schema      | Dynamic / Schema-less
3. Scalability     | Vertical (Scale-Up CPU/RAM)     | Horizontal (Scale-Out Nodes)
4. Transactions    | ACID compliant                  | BASE model (Eventual Consistency)
5. Complex Queries | Excellent (JOINs, Subqueries)   | Limited / Denormalized design
6. Examples        | MySQL, Oracle, PostgreSQL        | MongoDB, Apache Cassandra, Redis`
    },
    challenge: {
      title: 'SQL vs NoSQL Clash',
      description: 'Match architectural traits to their respective database philosophy.',
      steps: [
        {
          id: 'svsn-1',
          type: 'mcq',
          question: 'Which pair correctly matches the scaling philosophy of SQL vs NoSQL?',
          options: [
            'SQL: Horizontal scaling; NoSQL: Vertical scaling',
            'SQL: Vertical scaling (Scale-Up); NoSQL: Horizontal scaling (Scale-Out)',
            'Both only support vertical scaling',
            'Both only support horizontal scaling'
          ],
          correctIndex: 1,
          explanation: 'SQL traditional RDBMS scales vertically by adding more compute/RAM to one server; NoSQL scales horizontally by adding cheap commodity nodes.'
        }
      ]
    }
  },
  {
    id: 'q22-types-of-nosql',
    qNumber: 22,
    title: 'List Two Common Types of NoSQL Databases',
    shortCode: 'NOSQL-TYPES',
    marks: '4',
    examWeight: 'medium',
    realm: 'nosql_modern',
    realmName: 'Realm 6: Modern NoSQL (MongoDB & Cassandra)',
    realmOrder: 23,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'NoSQL databases are categorized into 4 primary architectural models: Document Stores, Wide-Column Stores, Key-Value Stores, and Graph Databases.',
      examKeyPoints: [
        'Type 1: Document Store (e.g. MongoDB, CouchDB): Stores data in JSON, BSON, or XML documents. Ideal for catalogs, user profiles, and content management.',
        'Type 2: Wide-Column Store / Columnar (e.g. Apache Cassandra, HBase): Stores data in columns grouped into column families. Optimized for fast writes and time-series telemetry.',
        'Type 3: Key-Value Store (e.g. Redis, DynamoDB): Simplest model; pairs unique key to arbitrary value blob. Ultra-fast caching and session management.',
        'Type 4: Graph Database (e.g. Neo4j): Uses nodes, edges, and properties for social networks and recommendation engines.'
      ],
      examProTips: [
        'The question asks for TWO types: Give Document (MongoDB) and Column-Oriented (Cassandra) since they appear explicitly later in your syllabus!'
      ],
      modelAnswer4Marks: `Two Common Types of NoSQL Databases:

1. Document-Oriented Database:
   - Data is stored in semi-structured documents, typically formatted in JSON or BSON.
   - Each document contains key-value pairs where values can be nested objects or arrays.
   - Example: MongoDB, CouchDB.
   - Use Case: E-commerce product catalogs, blogging platforms.

2. Wide-Column / Column-Family Store:
   - Data is organized into rows, where each row can have a dynamic set of columns grouped into column families.
   - Highly optimized for queries over huge volumes of distributed data.
   - Example: Apache Cassandra, Apache HBase.
   - Use Case: Real-time IoT sensor logs, financial transaction logs.`
    },
    challenge: {
      title: 'NoSQL Family Classifier',
      description: 'Identify the underlying NoSQL architectural model.',
      steps: [
        {
          id: 'type-1',
          type: 'mcq',
          question: 'MongoDB stores data in BSON format, while Apache Cassandra organizes data into column families. What types are they respectively?',
          options: [
            'Graph and Key-Value',
            'Document Store and Wide-Column Store',
            'Relational and Hierarchical',
            'Key-Value and Object-Oriented'
          ],
          correctIndex: 1,
          explanation: 'MongoDB is the premier Document Store, and Cassandra is the industry standard Wide-Column / Column-Family store.'
        }
      ]
    }
  },
  {
    id: 'q24-sql-in-cassandra',
    qNumber: 24,
    title: 'State the Significance of SQL in Cassandra (CQL)',
    shortCode: 'CASS-CQL',
    marks: '4',
    examWeight: 'medium',
    realm: 'nosql_modern',
    realmName: 'Realm 6: Modern NoSQL (MongoDB & Cassandra)',
    realmOrder: 24,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'Apache Cassandra provides CQL (Cassandra Query Language), an SQL-like declarative interface that bridges traditional relational familiarity with Cassandra\'s distributed wide-column architecture.',
      examKeyPoints: [
        '1. Familiarity for SQL Developers: Syntax resembles SQL (SELECT, INSERT, UPDATE, CREATE TABLE), flattening the learning curve.',
        '2. Abstraction of Internal Storage: Hides low-level internal Column-Family and Key-Value storage mechanics behind clean tabular abstractions.',
        '3. Differences from Standard SQL:',
        '   - NO JOIN operations (data must be denormalized).',
        '   - NO arbitrary subqueries.',
        '   - WHERE clauses strictly require the Partition Key unless ALLOW FILTERING is specified.',
        '4. Fast, Driver-Based Communication: Communicates over native binary protocol with high performance.'
      ],
      examProTips: [
        'Name it explicitly: CQL (Cassandra Query Language).',
        'Crucial exam point: State that while CQL looks like SQL, it intentionally omits JOINs and aggregations to ensure predictable distributed response times.'
      ],
      modelAnswer4Marks: `Significance of SQL in Cassandra (CQL - Cassandra Query Language):
1. User-Friendly Abstraction: CQL provides an SQL-like syntax (SELECT, INSERT, CREATE TABLE) which makes it easy for developers familiar with relational databases to interact with Cassandra.
2. Abstracting Column Families: It abstracts the underlying sparse column-family architecture into familiar rows and columns.
3. Architectural Restrictions:
   - Unlike standard SQL, CQL deliberately does NOT support JOINs or subqueries, enforcing denormalization for fast distributed reads.
   - Primary key queries are optimized through partition hashing.
4. Native Protocol Efficiency: CQL interacts directly with Cassandra cluster nodes via native binary protocol for high throughput.`
    },
    challenge: {
      title: 'CQL Syntax Inspector',
      description: 'Recognize the boundaries of Cassandra Query Language.',
      steps: [
        {
          id: 'cql-1',
          type: 'mcq',
          question: 'Why does Cassandra Query Language (CQL) deliberately omit support for SQL JOIN operations?',
          options: [
            'Cassandra developers forgot to code it',
            'Cross-node distributed joins are extremely slow and violate Cassandra\'s low-latency distributed design; data is denormalized instead',
            'CQL only supports read operations',
            'Because Cassandra is a relational database'
          ],
          correctIndex: 1,
          explanation: 'In a distributed multi-node cluster, joining tables across network partitions causes massive latency spikes. CQL enforces denormalization instead.'
        }
      ]
    }
  },
  {
    id: 'q25-create-db-cassandra',
    qNumber: 25,
    title: 'Steps Involved in Creating a New Database in Cassandra',
    shortCode: 'CASS-CREATE',
    marks: '4',
    examWeight: 'medium',
    realm: 'nosql_modern',
    realmName: 'Realm 6: Modern NoSQL (MongoDB & Cassandra)',
    realmOrder: 25,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'In Apache Cassandra, a "Database" is known as a KEYSPACE. A Keyspace is the top-level container for data objects, column families, and defines replication strategy across cluster nodes.',
      diagramType: 'nosql_tree',
      examKeyPoints: [
        'Step 1: Start Cassandra server daemon and launch CQL shell (cqlsh).',
        'Step 2: Execute CREATE KEYSPACE statement with replication strategy and replication factor.',
        'Syntax:',
        '  CREATE KEYSPACE university_db',
        '  WITH replication = {',
        '    \'class\': \'SimpleStrategy\',',
        '    \'replication_factor\': 3',
        '  };',
        'Step 3: Switch context into the newly created keyspace using:',
        '  USE university_db;',
        'Step 4: Verify keyspace creation with DESCRIBE KEYSPACES; or DESCRIBE KEYSPACE university_db;.'
      ],
      examProTips: [
        'Keywords to highlight: "KEYSPACE" is Cassandra\'s database equivalent; "SimpleStrategy" (for single data center) vs "NetworkTopologyStrategy" (for multi-datacenter); "replication_factor".'
      ],
      modelAnswer4Marks: `Basic Steps to Create a New Database in Cassandra:
In Cassandra, a database is called a "KEYSPACE".

Step 1: Open CQLSH (Cassandra Query Language Shell):
$ cqlsh

Step 2: Create the Keyspace with Replication Strategy:
CREATE KEYSPACE my_database 
WITH replication = {
   'class': 'SimpleStrategy',
   'replication_factor': 1
};
Explanation:
- 'class': 'SimpleStrategy' is used for a single datacenter.
- 'replication_factor': 1 specifies the number of copies of data on cluster nodes.

Step 3: Connect to / Select the Keyspace:
USE my_database;

Step 4: Verify the Keyspace:
DESCRIBE KEYSPACE my_database;`
    },
    challenge: {
      title: 'Cassandra CQL Shell Builder',
      description: 'Synthesize the exact CQL command to create a keyspace.',
      steps: [
        {
          id: 'cass-1',
          type: 'mcq',
          question: 'What is the top-level container in Apache Cassandra that corresponds to a "Database" in SQL?',
          options: ['Cluster', 'Keyspace', 'Column Family', 'Collection'],
          correctIndex: 1,
          explanation: 'In Apache Cassandra, the Keyspace is the outermost database namespace that defines replication attributes.'
        },
        {
          id: 'cass-2',
          type: 'mcq',
          question: 'Which replication strategy class is used in Cassandra when running on a single datacenter or local development machine?',
          options: ['NetworkTopologyStrategy', 'SimpleStrategy', 'RoundRobinStrategy', 'MasterSlaveStrategy'],
          correctIndex: 1,
          explanation: 'SimpleStrategy places replica copies on successive nodes on the cluster ring without multi-datacenter awareness.'
        }
      ]
    }
  },
  {
    id: 'q26-create-db-mongodb',
    qNumber: 26,
    title: 'Steps Involved in Creating a New Database in MongoDB',
    shortCode: 'MONGO-DB',
    marks: '4',
    examWeight: 'medium',
    realm: 'nosql_modern',
    realmName: 'Realm 6: Modern NoSQL (MongoDB & Cassandra)',
    realmOrder: 26,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'In MongoDB, databases are created lazily/dynamically. You switch to a database using the `use` command; the physical database is created automatically in memory and saved to disk only when data (a document) is first inserted.',
      examKeyPoints: [
        'Step 1: Start MongoDB server (`mongod`) and connect via MongoDB Shell (`mongosh` or `mongo`).',
        'Step 2: Use the `use` command followed by database name:',
        '  use collegeDB;',
        'Step 3: Check currently active database with command: `db`.',
        'Step 4: Crucial MongoDB Rule: The database will NOT appear in `show dbs` list until at least ONE collection and document is inserted!',
        'Step 5: Insert a document to materialize the database:',
        '  db.students.insertOne({ name: "Rahul", roll: 101 });'
      ],
      examProTips: [
        'Don\'t forget to mention: "MongoDB creates databases lazily on-the-fly when the first document is inserted. Running `show dbs` immediately after `use mydb` will not show it until data is saved."'
      ],
      modelAnswer4Marks: `Basic Steps in Creating a New Database in MongoDB:
Step 1: Launch MongoDB Shell:
Open terminal and start shell:
$ mongosh

Step 2: Switch to the Target Database Name:
Type the 'use' command:
> use studentDB
Output: switched to db studentDB

Step 3: Check Active Database:
Verify current selection:
> db
Output: studentDB

Step 4: Persist the Database (Lazy Creation):
In MongoDB, a database is not physically created until it contains data. Insert at least one document:
> db.records.insertOne({ id: 1, name: "Amit" })

Step 5: Verify Creation:
> show dbs
The studentDB will now be displayed in the database list.`
    },
    challenge: {
      title: 'MongoDB Shell Navigator',
      description: 'Understand lazy database instantiation in MongoDB.',
      steps: [
        {
          id: 'mongo-1',
          type: 'mcq',
          question: 'You type `use newCompanyDB` in the MongoDB shell. Then you run `show dbs`, but newCompanyDB is missing! Why?',
          options: [
            'There is a syntax error in `use`',
            'MongoDB requires root permissions to create databases',
            'MongoDB uses lazy creation: the database is only physically created once a collection and document are inserted into it',
            'The database was created in RAM and deleted immediately'
          ],
          correctIndex: 2,
          explanation: 'MongoDB creates databases lazily. Until at least one document is written into a collection, the database will not appear in `show dbs`.'
        }
      ]
    }
  },
  {
    id: 'q27-mongodb-full-setup',
    qNumber: 27,
    title: 'MongoDB Setup: Create Database, Collections & Insert Documents',
    shortCode: 'MONGO-FULL',
    marks: '4',
    examWeight: 'medium',
    realm: 'nosql_modern',
    realmName: 'Realm 6: Modern NoSQL (MongoDB & Cassandra)',
    realmOrder: 27,
    isBoss: false,
    teachBriefing: {
      coreDefinition: 'A complete MongoDB pipeline consists of: Creating/Switching Database (`use db`) -> Creating Collection explicitly (`createCollection`) or implicitly -> Inserting Documents (`insertOne` or `insertMany`).',
      diagramType: 'nosql_tree',
      diagramDescription: 'Database (e.g. ecommerceDB) -> Collections (e.g. products, orders) -> Documents (BSON records with _id: ObjectId).',
      examKeyPoints: [
        'Step 1: Select Database:',
        '  use companyDB;',
        'Step 2: Create Collection:',
        '  - Explicit creation: db.createCollection("employees");',
        '  - Implicit creation: automatically created when inserting document.',
        'Step 3: Insert Single Document:',
        '  db.employees.insertOne({ name: "Priya", role: "Dev", salary: 75000 });',
        'Step 4: Insert Multiple Documents:',
        '  db.employees.insertMany([',
        '    { name: "John", role: "Tester", salary: 50000 },',
        '    { name: "Sara", role: "Manager", salary: 90000 }',
        '  ]);',
        'Step 5: Query & Verify:',
        '  db.employees.find().pretty();'
      ],
      examProTips: [
        'Write both `insertOne()` and `insertMany()` with square brackets `[...]` to show mastery of JSON array syntax.',
        'Mention automatic generation of the `_id` field (ObjectId) by MongoDB.'
      ],
      modelAnswer4Marks: `Complete Steps to Setup MongoDB, Collections & Insert Documents:

1. Setup / Switch Database:
   > use hospitalDB;

2. Create Collection:
   Method A (Explicit):
   > db.createCollection("doctors");
   Method B (Implicit): Directly inserting into a collection auto-creates it.

3. Insert Single Document:
   > db.doctors.insertOne({
       doc_id: 101,
       name: "Dr. Sharma",
       specialty: "Cardiology",
       experience: 12
     });

4. Insert Multiple Documents:
   > db.doctors.insertMany([
       { doc_id: 102, name: "Dr. Mehta", specialty: "Neurology" },
       { doc_id: 103, name: "Dr. Rao", specialty: "Pediatrics" }
     ]);

5. Verify:
   > db.doctors.find();`
    },
    challenge: {
      title: 'Mongo Terminal Challenge',
      description: 'Execute the full document insertion workflow.',
      steps: [
        {
          id: 'mfull-1',
          type: 'mcq',
          question: 'Which method is used in modern MongoDB shell to insert multiple JSON documents in a single atomic batch?',
          options: [
            'db.collection.insertAll({...})',
            'db.collection.insertMany([{...}, {...}])',
            'db.collection.addRecords([...])',
            'db.collection.appendBatch({...})'
          ],
          correctIndex: 1,
          explanation: '`insertMany()` takes an array of document objects `[{...}, {...}]` and inserts them into the collection in a single batch.'
        },
        {
          id: 'mfull-2',
          type: 'mcq',
          question: 'If you omit the `_id` field when executing `insertOne({ name: "Apex" })`, what does MongoDB do?',
          options: [
            'Rejects the insert with a primary key error',
            'Automatically generates a unique 12-byte ObjectId as `_id`',
            'Sets `_id` to NULL',
            'Sets `_id` to 0'
          ],
          correctIndex: 1,
          explanation: 'MongoDB automatically generates a unique 12-byte BSON ObjectId timestamp-hash for the `_id` attribute if omitted.'
        }
      ]
    }
  }
];

export const INITIAL_USER_STATS = {
  xp: 0,
  level: 1,
  rankTitle: 'Query Trainee',
  lives: 5,
  maxLives: 5,
  streak: 0,
  bestStreak: 0,
  completedTopics: [] as string[],
  bossesDefeated: [] as string[],
  lastActive: new Date().toISOString(),
  soundEnabled: true,
  teacherMode: false
};

export const RANKS = [
  { level: 1, title: 'Query Trainee', minXp: 0 },
  { level: 2, title: 'ACID Explorer', minXp: 150 },
  { level: 3, title: 'Execution Planner', minXp: 400 },
  { level: 4, title: 'Lock Guard', minXp: 750 },
  { level: 5, title: 'Deadlock Hunter', minXp: 1200 },
  { level: 6, title: 'Serializability Slayer', minXp: 1800 },
  { level: 7, title: 'Timestamp Chronomancer', minXp: 2500 },
  { level: 8, title: 'NoSQL Architect', minXp: 3400 },
  { level: 9, title: 'Chief Database Maestro', minXp: 4500 },
  { level: 10, title: 'PT2 Exam Grandmaster', minXp: 6000 }
];
