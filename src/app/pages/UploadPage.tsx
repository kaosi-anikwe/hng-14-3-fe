import CsvUpload from '../components/CsvUpload'

export default function UploadPage() {
    return (
        <div>
            <div className="mb-8">
                <h1>Upload Profiles</h1>
                <p className="text-base-content/60">Import profiles in bulk via CSV file</p>
            </div>
            <div className="max-w-2xl">
                <CsvUpload />
            </div>
        </div>
    )
}
