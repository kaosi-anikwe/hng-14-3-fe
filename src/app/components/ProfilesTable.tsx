import { Link } from 'react-router-dom'
import type { Profile } from '../services/api'

interface ProfilesTableProps {
    profiles: Profile[]
    isLoading?: boolean
    skeletonRows?: number
}

export default function ProfilesTable({ profiles, isLoading, skeletonRows = 10 }: ProfilesTableProps) {
    return (
        <div className="card bg-base-100 shadow-sm">
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Age</th>
                            <th>Age Group</th>
                            <th>Country</th>
                            <th>Added</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading
                            ? Array.from({ length: skeletonRows }, (_, i) => (
                                <tr key={i}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="skeleton w-10 h-10 rounded-full shrink-0"></div>
                                            <div className="skeleton h-4 w-28"></div>
                                        </div>
                                    </td>
                                    <td><div className="skeleton h-4 w-14"></div></td>
                                    <td><div className="skeleton h-4 w-8"></div></td>
                                    <td><div className="skeleton h-5 w-16 rounded-full"></div></td>
                                    <td><div className="skeleton h-4 w-20"></div></td>
                                    <td><div className="skeleton h-4 w-20"></div></td>
                                    <td><div className="skeleton h-8 w-14 rounded"></div></td>
                                </tr>
                            ))
                            : profiles.map(profile => (
                                <tr key={profile.id} className="hover">
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar placeholder">
                                                <div className="flex justify-center items-center bg-neutral text-neutral-content rounded-full w-10">
                                                    <span className="text-xs">{profile.name.split(' ').map(n => n[0]).join('')}</span>
                                                </div>
                                            </div>
                                            <span>{profile.name}</span>
                                        </div>
                                    </td>
                                    <td className="capitalize">{profile.gender}</td>
                                    <td>{profile.age}</td>
                                    <td>
                                        <span className="badge badge-outline capitalize">{profile.age_group}</span>
                                    </td>
                                    <td>{profile.country_name}</td>
                                    <td className="text-base-content/60 text-sm">
                                        {new Date(profile.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <Link to={`/profiles/${profile.id}`} className="btn btn-ghost btn-sm">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
