import { describe, it, expect } from 'vitest';
import { filterJobs, sortByNewest, formatPostedDate } from './jobs';
import type { Job } from '../types/job';

function makeJob(
    slug: string,
    postedDate: string,
    department = 'Technology',
    location = 'Remote',
): Job {
    return {
        slug,
        title: `Role ${slug}`,
        department,
        location,
        type: 'Full-time',
        remote: true,
        postedDate,
        summary: 'A role.',
    };
}

describe('sortByNewest', () => {
    it('orders jobs by posted date, newest first', () => {
        const jobs = [
            makeJob('a', '2027-01-01'),
            makeJob('b', '2027-03-15'),
            makeJob('c', '2027-02-10'),
        ];
        expect(sortByNewest(jobs).map((j) => j.slug)).toEqual(['b', 'c', 'a']);
    });

    it('does not mutate the input array', () => {
        const jobs = [makeJob('a', '2027-01-01'), makeJob('b', '2027-03-15')];
        const original = jobs.map((j) => j.slug);
        sortByNewest(jobs);
        expect(jobs.map((j) => j.slug)).toEqual(original);
    });
});

describe('filterJobs', () => {
    const jobs = [
        makeJob('frontend', '2027-01-01', 'Technology', 'Remote'),
        makeJob('data', '2027-01-02', 'Technology', 'Vancouver, Canada'),
        makeJob('finance', '2027-01-03', 'Finance', 'Vancouver, Canada'),
    ];

    it('filters by department', () => {
        expect(filterJobs(jobs, 'Technology', '').map((job) => job.slug)).toEqual([
            'frontend',
            'data',
        ]);
    });

    it('filters by location', () => {
        expect(filterJobs(jobs, '', 'Vancouver, Canada').map((job) => job.slug)).toEqual([
            'data',
            'finance',
        ]);
    });

    it('combines department and location filters with AND', () => {
        expect(
            filterJobs(jobs, 'Technology', 'Vancouver, Canada').map((job) => job.slug),
        ).toEqual(['data']);
    });

    it('returns all jobs when filters are reset and returns no jobs for no matches', () => {
        expect(filterJobs(jobs, '', '')).toEqual(jobs);
        expect(filterJobs(jobs, 'Security', '')).toEqual([]);
    });

    it('does not mutate the input array', () => {
        const original = [...jobs];
        filterJobs(jobs, 'Technology', 'Remote');
        expect(jobs).toEqual(original);
    });
});

describe('formatPostedDate', () => {
    it('formats an ISO date as a readable string', () => {
        expect(formatPostedDate('2027-01-05')).toBe('January 5, 2027');
    });

    it('returns the raw value when the date is unparseable', () => {
        expect(formatPostedDate('not-a-date')).toBe('not-a-date');
    });
});
