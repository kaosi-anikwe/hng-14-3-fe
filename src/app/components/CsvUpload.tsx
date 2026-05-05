import { useRef, useState } from 'react'
import { Upload, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { apiClient } from '../services/api'

interface UploadResult {
    inserted: number
    skipped: number
    total_rows: number
    status: string
    reasons: {
        duplicate_name: number
        invalid_age: number
        invalid_countries: number
        missing_fields: number
    }
}

type UploadState = 'idle' | 'uploading' | 'processing' | 'done' | 'error'

function formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`
    const s = (ms / 1000).toFixed(2)
    return `${s}s`
}

export default function CsvUpload() {
    const [file, setFile] = useState<File | null>(null)
    const [state, setState] = useState<UploadState>('idle')
    const [uploadProgress, setUploadProgress] = useState(0)
    const [processingMs, setProcessingMs] = useState<number | null>(null)
    const [result, setResult] = useState<UploadResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    const processingStartRef = useRef<number | null>(null)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const [elapsedMs, setElapsedMs] = useState(0)

    const inputRef = useRef<HTMLInputElement>(null)

    const startProcessingTimer = () => {
        processingStartRef.current = Date.now()
        timerRef.current = setInterval(() => {
            setElapsedMs(Date.now() - processingStartRef.current!)
        }, 100)
    }

    const stopProcessingTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
        if (processingStartRef.current) {
            setProcessingMs(Date.now() - processingStartRef.current)
            processingStartRef.current = null
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] ?? null
        setFile(selected)
        setResult(null)
        setError(null)
        setState('idle')
        setUploadProgress(0)
        setProcessingMs(null)
        setElapsedMs(0)
    }

    const handleUpload = async () => {
        if (!file) return

        setState('uploading')
        setUploadProgress(0)
        setResult(null)
        setError(null)
        setProcessingMs(null)
        setElapsedMs(0)

        try {
            const response = await apiClient.post<UploadResult>('/api/upload', file, {
                headers: { 'Content-Type': 'application/octet-stream' },
                onUploadProgress: (event) => {
                    if (event.total) {
                        const pct = Math.round((event.loaded / event.total) * 100)
                        setUploadProgress(pct)
                        if (pct >= 100 && state !== 'processing') {
                            setState('processing')
                            startProcessingTimer()
                        }
                    }
                },
            })

            stopProcessingTimer()
            setResult(response.data)
            setState('done')
        } catch (err: unknown) {
            stopProcessingTimer()
            setState('error')
            const msg =
                err instanceof Error ? err.message : 'Upload failed'
            setError(msg)
        }
    }

    const reset = () => {
        setFile(null)
        setState('idle')
        setUploadProgress(0)
        setProcessingMs(null)
        setResult(null)
        setError(null)
        setElapsedMs(0)
        if (inputRef.current) inputRef.current.value = ''
    }

    const isUploading = state === 'uploading' || state === 'processing'

    return (
        <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
                <h2 className="card-title text-base">
                    <Upload size={18} /> Upload CSV
                </h2>

                {/* File picker */}
                <div
                    className="border-2 border-dashed border-base-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => !isUploading && inputRef.current?.click()}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".csv,text/csv"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                    <FileText size={32} className="mx-auto mb-2 text-base-content/40" />
                    {file ? (
                        <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-base-content/60">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p className="font-medium">Click to select a CSV file</p>
                            <p className="text-sm text-base-content/60">or drag and drop</p>
                        </div>
                    )}
                </div>

                {/* Upload progress */}
                {(state === 'uploading' || state === 'processing' || state === 'done') && (
                    <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                            <span>
                                {state === 'uploading'
                                    ? 'Uploading…'
                                    : state === 'processing'
                                        ? 'Processing on server…'
                                        : 'Upload complete'}
                            </span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <progress
                            className="progress progress-primary w-full"
                            value={uploadProgress}
                            max={100}
                        />
                    </div>
                )}

                {/* Processing timer */}
                {state === 'processing' && (
                    <div className="flex items-center gap-2 text-sm text-base-content/60">
                        <Clock size={14} className="animate-pulse" />
                        <span>Server processing: {formatDuration(elapsedMs)}</span>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 mt-2">
                    <button
                        className="btn btn-primary flex-1"
                        disabled={!file || isUploading}
                        onClick={handleUpload}
                    >
                        {isUploading && <span className="loading loading-spinner loading-sm" />}
                        {isUploading ? 'Uploading…' : 'Upload'}
                    </button>
                    {(state === 'done' || state === 'error') && (
                        <button className="btn btn-ghost" onClick={reset}>
                            Reset
                        </button>
                    )}
                </div>

                {/* Error */}
                {state === 'error' && error && (
                    <div className="alert alert-error mt-2">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Results */}
                {state === 'done' && result && (
                    <div className="mt-4 space-y-4">
                        <div className="flex items-center gap-2 text-success">
                            <CheckCircle size={16} />
                            <span className="font-medium">Upload complete</span>
                            {processingMs !== null && (
                                <span className="ml-auto text-sm text-base-content/60 flex items-center gap-1">
                                    <Clock size={13} />
                                    Server processed in {formatDuration(processingMs)}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="stat bg-base-200 rounded-lg p-3">
                                <div className="stat-title text-xs">Total Rows</div>
                                <div className="stat-value text-xl">{result.total_rows.toLocaleString()}</div>
                            </div>
                            <div className="stat bg-success/10 rounded-lg p-3">
                                <div className="stat-title text-xs">Inserted</div>
                                <div className="stat-value text-xl text-success">{result.inserted.toLocaleString()}</div>
                            </div>
                            <div className="stat bg-warning/10 rounded-lg p-3">
                                <div className="stat-title text-xs">Skipped</div>
                                <div className="stat-value text-xl text-warning">{result.skipped.toLocaleString()}</div>
                            </div>
                        </div>

                        {result.skipped > 0 && (
                            <div>
                                <p className="text-sm font-medium mb-2">Skip reasons</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(result.reasons).map(([key, val]) => (
                                        <div key={key} className="flex justify-between text-sm bg-base-200 rounded px-3 py-1">
                                            <span className="capitalize text-base-content/70">
                                                {key.replace(/_/g, ' ')}
                                            </span>
                                            <span className={val > 0 ? 'text-error font-medium' : 'text-base-content/40'}>
                                                {val.toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
